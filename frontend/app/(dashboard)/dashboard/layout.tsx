import LayoutWrapper from "@/components/layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <ThemeProvider>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </ThemeProvider>
        </div>
    );
}
