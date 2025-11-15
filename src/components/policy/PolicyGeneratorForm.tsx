import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import RequestAccessForm from './RequestAccessForm';

const formSchema = z.object({
  accessKey: z.string().optional(),
  policyType: z.string().min(1, 'Please select a policy type'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().optional(),
  specificRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PolicyGeneratorForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState<string>('');
  const [hasAccess, setHasAccess] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [savedAccessKey, setSavedAccessKey] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessKey: '',
      policyType: '',
      companyName: '',
      industry: '',
      specificRequirements: '',
    },
  });

  useEffect(() => {
    // Check if there's a saved access key in localStorage
    const savedKey = localStorage.getItem('policyGeneratorAccessKey');
    if (savedKey) {
      setSavedAccessKey(savedKey);
      form.setValue('accessKey', savedKey);
      validateAccessKey(savedKey);
    }
  }, []);

  const validateAccessKey = async (key: string) => {
    setIsValidatingKey(true);
    try {
      const { data, error } = await supabase.rpc('validate_policy_access_key', {
        key_to_validate: key
      });

      if (error) {
        console.error('Error validating access key:', error);
        setHasAccess(false);
        toast.error('Failed to validate access key');
        return;
      }

      const result = data as { valid: boolean; error?: string };

      if (!result.valid) {
        setHasAccess(false);
        toast.error(result.error || 'Invalid or expired access key');
        return;
      }

      setHasAccess(true);
      localStorage.setItem('policyGeneratorAccessKey', key);
      toast.success('Access key validated successfully!');
    } catch (error) {
      console.error('Error validating access key:', error);
      setHasAccess(false);
      toast.error('Failed to validate access key');
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleAccessKeyValidation = async () => {
    const key = form.getValues('accessKey');
    if (!key) {
      toast.error('Please enter an access key');
      return;
    }
    await validateAccessKey(key);
  };

  const onSubmit = async (values: FormValues) => {
    if (!hasAccess) {
      toast.error('Please validate your access key first');
      return;
    }

    setIsGenerating(true);
    setGeneratedPolicy('');

    try {
      const accessKey = savedAccessKey || form.getValues('accessKey');

      const { data, error } = await supabase.functions.invoke('generate-policy', {
        body: {
          ...values,
          accessKey: accessKey,
        },
      });

      if (error) throw error;

      if (data?.policyContent) {
        setGeneratedPolicy(data.policyContent);
        toast.success('Policy generated successfully!');
      } else {
        throw new Error('No policy content received');
      }
    } catch (error: any) {
      console.error('Error generating policy:', error);
      toast.error(error.message || 'Failed to generate policy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsWord = async () => {
    if (!generatedPolicy) return;

    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: form.getValues('policyType'),
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: form.getValues('companyName'),
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),
            ...generatedPolicy.split('\n').map(line => 
              new Paragraph({
                children: [new TextRun(line)],
                spacing: { after: 200 },
              })
            ),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `${form.getValues('policyType').replace(/\s+/g, '_')}_${form.getValues('companyName').replace(/\s+/g, '_')}.docx`;
      saveAs(blob, fileName);
      toast.success('Document downloaded successfully!');
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {!hasAccess ? (
        <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Access Key Required</h2>
          <p className="text-muted-foreground mb-6">
            You need a valid access key to use the Policy Generator. Enter your key below or request access.
          </p>
          <Form {...form}>
            <form onSubmit={(e) => { e.preventDefault(); handleAccessKeyValidation(); }} className="space-y-4">
              <FormField
                control={form.control}
                name="accessKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Key</FormLabel>
                    <FormControl>
                      <Input placeholder="PG-XXXXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isValidatingKey}
              >
                {isValidatingKey ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate Access Key'
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Don't have an access key?</p>
            <RequestAccessForm onAccessGranted={() => {}} />
          </div>
        </div>
      ) : (
        <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="policyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a policy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Information Security Policy">Information Security Policy</SelectItem>
                      <SelectItem value="Access Control Policy">Access Control Policy</SelectItem>
                      <SelectItem value="Incident Response Policy">Incident Response Policy</SelectItem>
                      <SelectItem value="Data Protection Policy">Data Protection Policy</SelectItem>
                      <SelectItem value="Acceptable Use Policy">Acceptable Use Policy</SelectItem>
                      <SelectItem value="Password Policy">Password Policy</SelectItem>
                      <SelectItem value="Remote Work Policy">Remote Work Policy</SelectItem>
                      <SelectItem value="Bring Your Own Device (BYOD) Policy">BYOD Policy</SelectItem>
                      <SelectItem value="Business Continuity Policy">Business Continuity Policy</SelectItem>
                      <SelectItem value="Vendor Management Policy">Vendor Management Policy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Healthcare, Finance, Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specificRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any specific requirements, compliance needs, or areas to focus on..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Policy...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Policy
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
      )}

      {generatedPolicy && hasAccess && (
        <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Generated Policy</h2>
            <Button onClick={downloadAsWord}>
              <Download className="mr-2 h-4 w-4" />
              Download Word Document
            </Button>
          </div>
          <div className="prose prose-sm max-w-none bg-background p-6 rounded-lg border border-border">
            <pre className="whitespace-pre-wrap text-sm">{generatedPolicy}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyGeneratorForm;
