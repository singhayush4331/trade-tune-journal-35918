import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Eye, 
  Check, 
  X, 
  Mail, 
  DollarSign,
  CreditCard,
  UserPlus,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Payment {
  id: string;
  user_id: string | null;
  amount: number;
  currency: string;
  payment_type: string;
  status: string;
  razorpay_order_id: string | null;
  manual_verification_notes: string | null;
  created_at: string;
}

interface AccountRequest {
  id: string;
  email: string;
  full_name: string;
  role_type: string;
  status: string;
  password_sent: boolean;
  created_at: string;
  notes: string | null;
}

const HavenArkAccountManager: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [accountRequests, setAccountRequests] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Form states for manual account creation
  const [newAccountForm, setNewAccountForm] = useState({
    email: '',
    fullName: '',
    roleType: 'haven_ark_masterclass',
    password: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

      // Load account creation requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('account_creation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      setAccountRequests(requestsData || []);

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewAccountForm(prev => ({ ...prev, password }));
  };

  const createAccount = async () => {
    if (!newAccountForm.email || !newAccountForm.fullName || !newAccountForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsCreatingAccount(true);

      // Create the account request record first
      const { data: requestData, error: requestError } = await supabase
        .from('account_creation_requests')
        .insert([{
          email: newAccountForm.email,
          full_name: newAccountForm.fullName,
          role_type: newAccountForm.roleType,
          notes: newAccountForm.notes,
          status: 'pending'
        }])
        .select()
        .single();

      if (requestError) throw requestError;

      // TODO: Call edge function to create actual user account and send email
      // For now, we'll just update the request status
      const { error: updateError } = await supabase
        .from('account_creation_requests')
        .update({ status: 'completed', processed_at: new Date().toISOString() })
        .eq('id', requestData.id);

      if (updateError) throw updateError;

      toast.success('Account creation request submitted successfully');
      
      // Reset form
      setNewAccountForm({
        email: '',
        fullName: '',
        roleType: 'haven_ark_masterclass',
        password: '',
        notes: ''
      });

      // Reload data
      loadData();

    } catch (error: any) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account: ' + error.message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const verifyPayment = async (paymentId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'completed', 
          manual_verification_notes: notes,
          verified_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast.success('Payment verified successfully');
      loadData();
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      completed: 'default',
      failed: 'destructive',
      manual_verification: 'secondary'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getRoleTypeBadge = (roleType: string) => {
    const colors: Record<string, string> = {
      haven_ark_masterclass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      wiggly_only: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };

    return (
      <Badge className={colors[roleType] || ''}>
        {roleType === 'haven_ark_masterclass' ? 'Haven ARK Masterclass' : 'Wiggly Only'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Haven ARK Account Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAccountForm.email}
                  onChange={(e) => setNewAccountForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="student@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={newAccountForm.fullName}
                  onChange={(e) => setNewAccountForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roleType">Account Type *</Label>
                <Select 
                  value={newAccountForm.roleType} 
                  onValueChange={(value) => setNewAccountForm(prev => ({ ...prev, roleType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haven_ark_masterclass">Haven ARK Masterclass (₹35,000)</SelectItem>
                    <SelectItem value="wiggly_only">Wiggly Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="text"
                    value={newAccountForm.password}
                    onChange={(e) => setNewAccountForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Auto-generated password"
                  />
                  <Button type="button" variant="outline" onClick={generatePassword}>
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newAccountForm.notes}
                  onChange={(e) => setNewAccountForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>
              
              <Button 
                onClick={createAccount} 
                disabled={isCreatingAccount} 
                className="w-full"
              >
                {isCreatingAccount ? 'Creating...' : 'Create Account & Send Email'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payments ({payments.length})
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Account Requests ({accountRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Razorpay ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        ₹{payment.amount.toLocaleString()} {payment.currency}
                      </TableCell>
                      <TableCell>
                        {getRoleTypeBadge(payment.payment_type)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {payment.razorpay_order_id || 'Manual'}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {payment.status === 'pending' || payment.status === 'manual_verification' ? (
                          <Button
                            size="sm"
                            onClick={() => verifyPayment(payment.id, 'Manually verified by admin')}
                            className="flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            Verify
                          </Button>
                        ) : (
                          <Badge variant="outline">Processed</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Account Creation Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Password Sent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.full_name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        {getRoleTypeBadge(request.role_type)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.password_sent ? 'default' : 'outline'}>
                          {request.password_sent ? 'Sent' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' ? (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="outline">Processed</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {accountRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No account requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HavenArkAccountManager;