import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Info, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'role_change' | 'permission_denied' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
}

const SecurityAuditLog = () => {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock security events for demo
    // In a real implementation, this would fetch from a secure audit log
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        severity: 'low',
        message: 'User successfully authenticated',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user_email: 'user@example.com',
        ip_address: '192.168.1.100'
      },
      {
        id: '2',
        type: 'role_change',
        severity: 'medium',
        message: 'User role changed from user to moderator',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user_email: 'admin@example.com',
        ip_address: '192.168.1.101'
      },
      {
        id: '3',
        type: 'permission_denied',
        severity: 'medium',
        message: 'Unauthorized access attempt to admin panel',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user_email: 'suspicious@example.com',
        ip_address: '10.0.0.50'
      },
      {
        id: '4',
        type: 'suspicious_activity',
        severity: 'high',
        message: 'Multiple failed login attempts detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        ip_address: '192.168.1.200'
      }
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Shield className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You need administrator privileges to view security logs.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Log
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading security events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No security events found</div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-4 border rounded-lg"
              >
                <div className="mt-0.5">
                  {getSeverityIcon(event.severity)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(event.severity) as any}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {event.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium">{event.message}</p>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Time: {new Date(event.timestamp).toLocaleString()}</div>
                    {event.user_email && <div>User: {event.user_email}</div>}
                    {event.ip_address && <div>IP: {event.ip_address}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;