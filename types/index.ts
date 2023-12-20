
export interface LoadingButtonProps {
    title: string;
    isProcessing: boolean;
    customStyle?: string;
    action?: () => void;
}

export interface PlanDetails {
    title: string;
    sessionDuration: number;
    sessionsCount: number;
    sessionsPerWeek: number;
    recommended: boolean;
    discount?: number;
    type?: string;
}