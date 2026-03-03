import { createElement } from "react";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    highlight: string;
}

export function FeatureCard({ icon, title, description, highlight }: FeatureCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <CardHeader className="relative z-10 pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    {createElement(icon, { className: "h-6 w-6" })}
                </div>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-base leading-relaxed mt-2">{description}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
                <Badge variant="secondary" className="px-3 py-1 font-medium bg-secondary/50 text-secondary-foreground">
                    {highlight}
                </Badge>
            </CardContent>
        </Card>
    );
}
