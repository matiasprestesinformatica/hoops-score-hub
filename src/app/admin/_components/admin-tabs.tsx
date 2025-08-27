'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface AdminTabsProps {
  teamsContent: React.ReactNode;
  playersContent: React.ReactNode;
}

export function AdminTabs({ teamsContent, playersContent }: AdminTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'teams';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="teams">Equipos</TabsTrigger>
        <TabsTrigger value="players">Jugadores</TabsTrigger>
      </TabsList>
      <TabsContent value="teams">
        {teamsContent}
      </TabsContent>
      <TabsContent value="players">
        {playersContent}
      </TabsContent>
    </Tabs>
  );
}
