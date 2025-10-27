import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Key, Copy } from 'lucide-react';
import { format } from 'date-fns';

interface AccessRequest {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
  phone_number: string | null;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
}

interface AccessKey {
  id: string;
  access_key: string;
  email: string;
  expires_at: string | null;
  usage_count: number;
  max_usage: number | null;
  is_active: boolean;
  created_at: string;
}

const AdminPolicyAccess = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, keysRes] = await Promise.all([
        supabase
          .from('policy_generator_access_requests')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('policy_generator_keys')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (requestsRes.data) setRequests(requestsRes.data as AccessRequest[]);
      if (keysRes.data) setKeys(keysRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: string, email: string) => {
    try {
      // Generate access key
      const { data: keyData, error: keyError } = await supabase.rpc('generate_access_key');
      
      if (keyError) throw keyError;

      // Create 7-day trial key
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: insertError } = await supabase
        .from('policy_generator_keys')
        .insert({
          access_request_id: requestId,
          access_key: keyData,
          email: email,
          expires_at: expiresAt.toISOString(),
          is_active: true,
        });

      if (insertError) throw insertError;

      // Update request status
      const { error: updateError } = await supabase
        .from('policy_generator_access_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast.success('Access request approved! Key generated.');
      fetchData();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('policy_generator_access_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Access request rejected');
      fetchData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Policy Generator Access Management - Admin</title>
      </Helmet>
      
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Policy Generator Access Management</h1>
          
          {/* Access Requests */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Access Requests</CardTitle>
              <CardDescription>Review and approve access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.full_name}</TableCell>
                      <TableCell>{request.company_name || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{format(new Date(request.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveRequest(request.id, request.email)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectRequest(request.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Active Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Active Access Keys</CardTitle>
              <CardDescription>Manage active policy generator keys</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Access Key</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span>{key.access_key}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(key.access_key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{key.email}</TableCell>
                      <TableCell>
                        {key.usage_count} {key.max_usage ? `/ ${key.max_usage}` : '/ unlimited'}
                      </TableCell>
                      <TableCell>
                        {key.expires_at ? format(new Date(key.expires_at), 'MMM dd, yyyy') : 'Never'}
                      </TableCell>
                      <TableCell>
                        {key.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPolicyAccess;
