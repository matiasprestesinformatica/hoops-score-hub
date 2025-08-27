"use client";

import type { Play } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dribbble, RotateCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PlayByPlayFeedProps {
  plays: Play[];
}

export function PlayByPlayFeed({ plays }: PlayByPlayFeedProps) {
  return (
    <Card className="h-[400px] md:h-full shadow-lg bg-card/80 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dribbble className="w-6 h-6" />
          Jugada a Jugada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] md:h-[520px] pr-4">
          {plays.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>El partido no ha comenzado.</p>
            </div>
          ) : (
            <Table>
              <TableBody>
                {[...plays].map((play) => (
                  <TableRow key={play.id} className={cn("border-primary/10 transition-colors", play.undone && "bg-destructive/20 text-muted-foreground")}>
                    <TableCell className="w-[80px] font-mono text-xs align-top pt-3">
                      [{play.time}]
                    </TableCell>
                    <TableCell className={cn("font-medium text-sm align-top pt-3", play.undone && "line-through")}>{play.teamName}</TableCell>
                    <TableCell className={cn("text-sm align-top pt-3", play.undone && "line-through")}>
                       {play.undone && <RotateCcw className="inline-block mr-2 h-3 w-3" />}
                       {play.summary}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
