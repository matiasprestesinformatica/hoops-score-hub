interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-card border-border">
            <div className="text-primary">
                {icon}
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}
