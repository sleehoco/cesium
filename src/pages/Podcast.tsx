import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Play, Pause, Calendar, Mic, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/utils/MetaTags";

interface PodcastEpisode {
  id: string;
  title: string;
  audio_url: string;
  published_at: string;
  created_at: string;
}

const Podcast = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [publishDate, setPublishDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const { data: episodes, isLoading } = useQuery({
    queryKey: ["podcast-episodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("podcast_episodes")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as PodcastEpisode[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!audioFile || !title) {
        throw new Error("Please provide a title and audio file");
      }

      setUploading(true);

      // Upload audio file
      const fileExt = audioFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("podcasts")
        .upload(fileName, audioFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("podcasts")
        .getPublicUrl(fileName);

      // Insert episode record
      const { error: insertError } = await supabase
        .from("podcast_episodes")
        .insert({
          title,
          audio_url: urlData.publicUrl,
          published_at: publishDate,
          created_by: user?.id,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      toast.success("Episode uploaded successfully!");
      setTitle("");
      setAudioFile(null);
      setPublishDate(format(new Date(), "yyyy-MM-dd"));
      queryClient.invalidateQueries({ queryKey: ["podcast-episodes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      toast.error("Please select a valid audio file");
    }
  };

  const togglePlay = (id: string) => {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause any currently playing audio
      if (playingId) {
        const currentAudio = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
        currentAudio?.pause();
      }
      audio.play();
      setPlayingId(id);
    }
  };

  return (
    <>
      <MetaTags
        title="Podcast | CyberSecure"
        description="Listen to our cybersecurity podcast episodes featuring expert insights on security, privacy, and digital protection."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                CyberSecure Podcast
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert insights on cybersecurity, privacy, and digital protection. New episodes released regularly.
              </p>
            </div>

            {/* Admin Upload Section */}
            {isAdmin && (
              <Card className="mb-8 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload New Episode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Episode Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter episode title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Publish Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audio">Audio File (MP3)</Label>
                    <Input
                      id="audio"
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {audioFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {audioFile.name}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => uploadMutation.mutate()}
                    disabled={uploading || !title || !audioFile}
                    className="w-full md:w-auto"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Episode
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Episodes List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                All Episodes
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : episodes?.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No episodes yet. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                episodes?.map((episode) => (
                  <Card
                    key={episode.id}
                    className="hover:border-primary/30 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 w-12 h-12 rounded-full"
                          onClick={() => togglePlay(episode.id)}
                        >
                          {playingId === episode.id ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </Button>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-foreground truncate">
                            {episode.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(episode.published_at), "MMMM d, yyyy")}
                          </div>
                          <audio
                            id={`audio-${episode.id}`}
                            src={episode.audio_url}
                            className="w-full mt-3"
                            controls
                            onEnded={() => setPlayingId(null)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Podcast;
