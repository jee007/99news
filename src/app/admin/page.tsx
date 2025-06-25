
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Users, Eye, TrendingUp, CircleAlert, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Login Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

// Ad Settings Schema
const adSettingsSchema = z.object({
  ezoicKey: z.string().optional(),
  adsenseKey: z.string().optional(),
  adSlotId: z.string().optional(),
  gaMeasurementId: z.string().optional(),
});

const ADMIN_EMAIL = 'syedjeelan006@gmail.com';
const ADMIN_PASSWORD = 'Jeddah@newspaper007';

// Placeholder data for analytics
const kpiData = {
    totalVisits: '1.2M',
    uniqueVisitors: '876K',
    pageViews: '3.4M',
    bounceRate: '45.7%',
};

const trafficData = [
    { country: 'India', visitors: 45000 },
    { country: 'USA', visitors: 28000 },
    { country: 'UAE', visitors: 18000 },
    { country: 'Pakistan', visitors: 12000 },
    { country: 'Saudi Arabia', visitors: 9000 },
    { country: 'Bangladesh', visitors: 6000 },
];

const trafficChartConfig = {
    visitors: {
        label: 'Visitors',
        color: 'hsl(var(--primary))',
    },
} satisfies ChartConfig;

const topArticles = [
    { title: 'Global Tech Market Hits New Highs', views: '125.4K' },
    { title: 'National Sports Championship Concludes', views: '98.8K' },
    { title: 'The Future of AI in Entertainment', views: '87.6K' },
    { title: 'Business Trends to Watch in the Next Quarter', views: '76.5K' },
    { title: 'A Deep Dive into International Relations', views: '65.4K' },
];


function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof adSettingsSchema>>({
    resolver: zodResolver(adSettingsSchema),
    defaultValues: {
      ezoicKey: '',
      adsenseKey: 'ca-pub-4135832301482741',
      adSlotId: '',
      gaMeasurementId: '',
    },
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const settingsDocRef = doc(db, 'settings', 'ads');
            const docSnap = await getDoc(settingsDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.reset({
                    ezoicKey: data.ezoicKey || '',
                    adsenseKey: data.adsenseKey || 'ca-pub-4135832301482741',
                    adSlotId: data.adSlotId || '',
                    gaMeasurementId: data.gaMeasurementId || '',
                });
            }
        } catch (error) {
            console.error("Error fetching ad settings from Firestore:", error);
            toast({
                variant: 'destructive',
                title: 'Load Failed',
                description: 'Could not load settings from the database.',
            });
        }
    };
    fetchSettings();
  }, [form, toast]);


  async function onSubmit(values: z.infer<typeof adSettingsSchema>) {
     setIsSaving(true);
     try {
        const settingsDocRef = doc(db, 'settings', 'ads');
        await setDoc(settingsDocRef, {
            ezoicKey: values.ezoicKey || '',
            adsenseKey: values.adsenseKey || '',
            adSlotId: values.adSlotId || '',
            gaMeasurementId: values.gaMeasurementId || '',
        }, { merge: true });

        toast({
            title: 'Settings Saved',
            description: 'Your ad settings have been saved. They will be applied on the next page refresh.',
        });
     } catch (error) {
        console.error("Error saving ad settings to Firestore:", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save settings to the database.',
        });
     } finally {
        setIsSaving(false);
     }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Ad Settings</CardTitle>
              <CardDescription className="pt-1">Manage your ad integration keys here. Settings are saved in Firebase.</CardDescription>
            </div>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="ezoicKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ezoic Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Ezoic key" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Ezoic integration key.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adsenseKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google AdSense Publisher ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ca-pub-xxxxxxxxxxxxxxxx" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Google AdSense client ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adSlotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google AdSense Ad Slot ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Ad Slot ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      The ID of the specific ad unit to display (e.g., 1234567890).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="gaMeasurementId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Analytics Measurement ID</FormLabel>
                    <FormControl>
                      <Input placeholder="G-XXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your GA4 Measurement ID for tracking page views.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-headline font-bold mb-4">Website Analytics</h2>
        <CardDescription className="mb-4 -mt-2">
            Currently displaying placeholder data. Connect Google Analytics above to begin tracking live metrics.
        </CardDescription>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalVisits}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.pageViews}</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.uniqueVisitors}</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <CircleAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.bounceRate}</div>
              <p className="text-xs text-muted-foreground">-2.5% from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Traffic by Country</CardTitle>
              <CardDescription>Your top traffic sources by country for the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
               <ChartContainer config={trafficChartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={trafficData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="country"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="visitors" fill="var(--color-visitors)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
             <CardHeader>
              <CardTitle>Top Articles</CardTitle>
              <CardDescription>Your most viewed articles in the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topArticles.map((article) => (
                    <TableRow key={article.title}>
                      <TableCell className="font-medium truncate max-w-xs">{article.title}</TableCell>
                      <TableCell className="text-right">{article.views}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function LoginForm() {
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoggingIn(true);
    // Note: The admin user must be created in the Firebase console first.
    if (values.email !== ADMIN_EMAIL || values.password !== ADMIN_PASSWORD) {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid email or password.',
        });
        setIsLoggingIn(false);
        return;
    }

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin panel.',
      });
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Invalid email or password. Ensure the admin user exists in Firebase.',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Login Error',
                description: 'An unexpected error occurred. Please try again.',
            });
            console.error("Firebase login error:", error);
        }
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
     <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription className="pt-1">Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
  );
}


export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };
  
  if (loading) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-headline font-bold mb-6">Admin Panel</h1>
          {user ? (
            <AdminPanel onLogout={handleLogout} />
          ) : (
            <LoginForm />
          )}
      </div>
    </div>
  );
}
