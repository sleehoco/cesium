import React, { useEffect, useState } from 'react';
import { Shield, Calendar, MapPin, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FingerprintRecord {
  id: string;
  session_id: string;
  ip_address: string;
  user_agent: string;
  risk_score: number;
  detected_threats: string[];
  created_at: string;
}

const FingerprintHistory = () => {
  const [records, setRecords] = useState<FingerprintRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('connection_fingerprints')
        .select('id, session_id, ip_address, user_agent, risk_score, detected_threats, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setRecords((data || []).map(record => ({
        ...record,
        ip_address: String(record.ip_address || 'unknown')
      })));
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load fingerprint history');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Connection Analysis
        </CardTitle>
        <CardDescription>
          Historical fingerprint and security analysis records
        </CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No records found
          </p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {record.session_id}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getRiskColor(record.risk_score)} text-white border-0`}
                  >
                    Risk: {record.risk_score}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">IP:</span>
                    <span className="font-mono">{record.ip_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(record.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {record.detected_threats && record.detected_threats.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-1">Threats:</p>
                    <div className="flex flex-wrap gap-1">
                      {record.detected_threats.map((threat, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {threat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground truncate">
                    User Agent: {record.user_agent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FingerprintHistory;