'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const formSchema = z.object({
  code: z.string().min(6, 'Your code must be 6 characters.'),
});

export default function CodeVerification() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast('Verification Successful', {
      description: `You have entered code: ${data.code}`,
    });
    // Mock navigation to dashboard or home
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verify Code</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="code-verification-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="code"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="code" className="sr-only">
                        One-Time Password
                      </FieldLabel>
                      <div className="flex justify-center w-full">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              form="code-verification-form"
              className="w-full"
            >
              Verify
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              didn&apos;t receive a code?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-primary"
              >
                Resend
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline underline-offset-4">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
