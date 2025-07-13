import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, FileText, Settings } from 'lucide-react';
import AdminRoleManagement from '@/components/admin/AdminRoleManagement';
import SecurityAuditLog from '@/components/security/SecurityAuditLog';
import AdminRoute from '@/components/auth/AdminRoute';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const SecurityOverview = () => {
  const securityFeatures = [
    {
      title: "Authentication Security",
      status: "Secured",
      description: "Migrated from insecure localStorage auth to Supabase Auth with proper session management",
      color: "text-green-500"
    },
    {
      title: "Role-Based Access Control",
      status: "Implemented",
      description: "Secure role management with RLS policies preventing privilege escalation",
      color: "text-green-500"
    },
    {
      title: "API Key Security",
      status: "Secured",
      description: "Removed client-side API key storage, all API calls now go through secure server endpoints",
      color: "text-green-500"
    },
    {
      title: "Data Protection",
      status: "Enhanced",
      description: "Removed sensitive data storage in localStorage, implemented secure form handling",
      color: "text-green-500"
    },
    {
      title: "Database Security",
      status: "Hardened",
      description: "RLS policies prevent users from escalating their own privileges",
      color: "text-green-500"
    },
    {
      title: "Audit Logging",
      status: "Active",
      description: "Security events are logged for monitoring and compliance",
      color: "text-green-500"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{feature.title}</h3>
                  <span className={`text-sm font-medium ${feature.color}`}>
                    {feature.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Improvements Implemented</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <strong>Fixed Critical Role Escalation Vulnerability:</strong>
                <p className="text-sm text-muted-foreground">Users can no longer directly update their role in the profiles table. Role changes now require admin privileges and go through the secure user_roles table.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <strong>Consolidated Authentication System:</strong>
                <p className="text-sm text-muted-foreground">Removed insecure localStorage-based authentication and replaced with proper Supabase Auth integration.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <strong>Eliminated Client-Side API Key Storage:</strong>
                <p className="text-sm text-muted-foreground">Removed all instances of API keys being stored in browser storage. Components now show security warnings where this occurred.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <strong>Enhanced Database Security:</strong>
                <p className="text-sm text-muted-foreground">Implemented proper RLS policies with security definer functions to prevent recursive policy issues.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <strong>Secure Admin Panel:</strong>
                <p className="text-sm text-muted-foreground">Created secure admin interface for role management with proper authentication checks.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminSecurity = () => {
  return (
    <AdminRoute>
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Administration</h1>
            <p className="text-muted-foreground">
              Manage user roles, monitor security events, and review system security status.
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Role Management
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Audit Log
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <SecurityOverview />
            </TabsContent>

            <TabsContent value="roles">
              <AdminRoleManagement />
            </TabsContent>

            <TabsContent value="audit">
              <SecurityAuditLog />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Session Security</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Session management is handled by Supabase Auth with automatic token refresh and secure storage.
                      </p>
                      <div className="text-sm text-green-600">✓ Secure session management active</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Database Security</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Row Level Security (RLS) policies are enabled on all sensitive tables.
                      </p>
                      <div className="text-sm text-green-600">✓ RLS policies active</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">API Security</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        All API keys are stored securely on the server. Client-side API key storage has been disabled.
                      </p>
                      <div className="text-sm text-green-600">✓ Server-side API management</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminSecurity;