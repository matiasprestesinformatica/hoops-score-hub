import type { Season } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { SeasonActions } from "./season-actions";
import Link from "next/link";

interface SeasonsTableProps {
    seasons: Season[];
}

export function SeasonsTable({ seasons }: SeasonsTableProps) {
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-accent/50 border-b-border">
                        <TableHead>Nombre de la Temporada</TableHead>
                        <TableHead className="text-center">Equipos en Playoffs</TableHead>
                        <TableHead className="text-center">Equipos en Descenso</TableHead>
                        <TableHead className="text-right w-[240px]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {seasons.length > 0 ? (
                    seasons.map((season) => (
                    <TableRow key={season.id} className="border-b-border/50 hover:bg-accent/50">
                        <TableCell className="font-medium text-foreground">{season.name}</TableCell>
                        <TableCell className="text-center font-mono">{season.playoffTeams}</TableCell>
                        <TableCell className="text-center font-mono">{season.relegationTeams}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/temporadas/${season.id}/equipos`}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Gestionar Equipos
                                </Link>
                            </Button>
                            <SeasonActions season={season} />
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No hay temporadas. ¡Añade una para empezar!
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </Card>
    );
}
