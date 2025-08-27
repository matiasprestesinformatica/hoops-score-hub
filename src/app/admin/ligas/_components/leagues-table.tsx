import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import type { League } from "@prisma/client";
import { LeagueActions } from "./league-actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface LeaguesTableProps {
    leagues: League[];
}

export function LeaguesTable({ leagues }: LeaguesTableProps) {
    return (
        <Card>
            <Table>
                <TableHeader>
                <TableRow className="hover:bg-accent/50 border-b-border">
                    <TableHead>Nombre de la Liga</TableHead>
                    <TableHead className="text-right w-[240px]">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {leagues.length > 0 ? (
                    leagues.map((league) => (
                    <TableRow key={league.id} className="border-b-border/50 hover:bg-accent/50">
                        <TableCell className="font-medium text-foreground">{league.name}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/ligas/${league.id}/temporadas`}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Gestionar Temporadas
                                </Link>
                            </Button>
                            <LeagueActions league={league} />
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                        No hay ligas. ¡Añade una para empezar!
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </Card>
    );
}
