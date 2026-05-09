export declare function useSessionMonitor(): void;
export declare function useInactivityGuard(onWarning?: (secondsLeft: number) => void): {
    getInactiveMs: () => number;
    resetActivity: () => void;
};
//# sourceMappingURL=useSessionMonitor.d.ts.map