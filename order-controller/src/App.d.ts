export enum RoleType {
    NORMAL = 'NORMAL',
    VIP = 'VIP'
}

export enum OrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS'
}

export interface OrderItemType {
    id: number
    role: RoleType
    name: string
    status: OrderStatus
}