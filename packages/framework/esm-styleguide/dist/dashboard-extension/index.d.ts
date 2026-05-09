import { type IconId } from '../icons';
export interface DashboardExtensionProps {
    path: string;
    title: string;
    basePath?: string;
    icon?: IconId;
}
export declare const DashboardExtension: ({ path, title, basePath, icon }: DashboardExtensionProps) => import("react/jsx-runtime").JSX.Element;
export declare function createDashboard(props: Omit<DashboardExtensionProps, 'basePath'>): ({ basePath }: {
    basePath: string;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map