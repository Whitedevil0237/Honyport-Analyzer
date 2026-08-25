import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import LandingPage from '@/pages/landing';
import DashboardPage from '@/pages/dashboard';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
import { pinoHttp } from 'pino-http';

// Initialize like this:
import { Request, Response } from 'express';

// Line 13 & Line 20 fixes:
app.get('/route-1', (req: Request, res: Response) => {
  // ...
});

app.get('/route-2', (req: Request, res: Response) => {
  // ...
});
app.use(pinoHttp());
function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
