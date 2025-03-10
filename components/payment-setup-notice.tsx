import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const PaymentSetupNotice = () => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Payment Setup Required</CardTitle>
        <CardDescription>
          Payment processing is not configured yet. You need to add your Stripe keys.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          To enable payments, you need to add your Stripe API keys to the environment variables.
          Follow the instructions in the docs to set up Stripe.
        </p>
        <Button asChild variant="outline">
          <Link href="https://github.com/ObaidUr-Rahmaan/titan" target="_blank">
            View Documentation
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}; 