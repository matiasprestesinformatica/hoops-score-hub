"use client";
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, link, linkText, icon }: FeatureCardProps) {
  return (
    <Card className="group bg-card border-border transition-all duration-300 ease-in-out hover:bg-accent flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div className="space-y-2">
                <CardTitle className="font-headline text-2xl text-primary">{title}</CardTitle>
                <CardDescription className="text-muted-foreground">{description}</CardDescription>
            </div>
            <div className="text-muted-foreground transition-transform duration-200 ease-in-out group-hover:scale-110">
                {icon}
            </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link href={link} passHref>
          <Button variant="secondary" className="w-full">
            {linkText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
