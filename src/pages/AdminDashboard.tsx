import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, Users, Settings, FileText, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard - CesiumCyber Security</title>
        <meta name="description" content="Administrative dashboard for CesiumCyber Security management." />
      </Helmet>
      
      <BackgroundAnimations />
      <Navbar />
      
      <main className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Shield className="h-10 w-10 text-cesium" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your CesiumCyber Security platform
            </p>
          </div>

          {/* Admin Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Role Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cesium" />
                  Role Management
                </CardTitle>
                <CardDescription>
                  Manage user roles and permissions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/roles">
                  <Button className="w-full">
                    Manage Roles
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cesium" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies and audit settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/security">
                  <Button className="w-full">
                    Security Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Blog Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cesium" />
                  Content Management
                </CardTitle>
                <CardDescription>
                  Create and manage blog posts and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/blog-generator">
                  <Button className="w-full">
                    AI Blog Generator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sales Pipeline */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cesium" />
                  Sales Pipeline
                </CardTitle>
                <CardDescription>
                  Track and manage leads from all sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/sales">
                  <Button className="w-full">
                    View Sales Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Platform Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cesium">--</div>
                  <p className="text-xs text-muted-foreground">Connect analytics to view</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Security Scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cesium">--</div>
                  <p className="text-xs text-muted-foreground">Connect analytics to view</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cesium">--</div>
                  <p className="text-xs text-muted-foreground">Connect analytics to view</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;