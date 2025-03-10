import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const EmailSetupNotice = () => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Email Setup Required</CardTitle>
        <CardDescription>
          Email sending is not configured yet. You need to add your email provider credentials.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          To enable email functionality, you need to add your email provider API keys to the environment variables.
          Follow the instructions in the docs to set up email services.
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