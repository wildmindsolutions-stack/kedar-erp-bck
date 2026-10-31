export declare class CreateDeliveryAreaDto {
    name: string;
    pincodes: string[];
    supervisorId?: string | null;
}
export declare class UpdateDeliveryAreaDto {
    name?: string;
    pincodes?: string[];
    supervisorId?: string | null;
    isActive?: boolean;
}
export declare class SetSupervisorDto {
    supervisorId?: string | null;
}
