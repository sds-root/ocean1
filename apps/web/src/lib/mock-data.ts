export type Service = {
  id: string
  name: string
  description: string
}

export type ResourceNode = {
  id: string
  name: string
  type: "folder" | "resource"
  resourceType?: "ec2" | "rds" | "k8s" | "s3"
  status?: "running" | "stopped" | "error"
  children?: ResourceNode[]
}

export type Ticket = {
  id: string
  title: string
  status: "open" | "in_progress" | "resolved"
  priority: "high" | "medium" | "low"
  assignee?: string
  createdAt: string
}

export const mockServices: Service[] = [
  { id: "svc-payment", name: "Payment Service", description: "Core payment processing system" },
  { id: "svc-auth", name: "Auth Service", description: "User authentication & authorization" },
  { id: "svc-inventory", name: "Inventory System", description: "Product stock management" },
]

export const mockResources: Record<string, ResourceNode[]> = {
  "svc-payment": [
    {
      id: "folder-aws",
      name: "AWS Production",
      type: "folder",
      children: [
        {
          id: "folder-compute",
          name: "Compute",
          type: "folder",
          children: [
            { id: "ec2-pay-api-01", name: "api-server-01", type: "resource", resourceType: "ec2", status: "running" },
            { id: "ec2-pay-api-02", name: "api-server-02", type: "resource", resourceType: "ec2", status: "running" },
            { id: "ec2-pay-worker", name: "payment-worker", type: "resource", resourceType: "ec2", status: "stopped" },
          ]
        },
        {
          id: "folder-db",
          name: "Database",
          type: "folder",
          children: [
            { id: "rds-main", name: "payment-db-primary", type: "resource", resourceType: "rds", status: "running" },
            { id: "rds-read", name: "payment-db-replica", type: "resource", resourceType: "rds", status: "running" },
          ]
        }
      ]
    },
    {
      id: "folder-k8s",
      name: "Kubernetes Cluster",
      type: "folder",
      children: [
        { id: "pod-pay-gw", name: "payment-gateway", type: "resource", resourceType: "k8s", status: "running" },
        { id: "pod-pay-settle", name: "settlement-job", type: "resource", resourceType: "k8s", status: "error" },
      ]
    }
  ],
  "svc-auth": [
    {
      id: "folder-auth-aws",
      name: "AWS Auth",
      type: "folder",
      children: [
        { id: "ec2-auth-01", name: "auth-server", type: "resource", resourceType: "ec2", status: "running" }
      ]
    }
  ],
  "svc-inventory": [
    {
      id: "folder-inv-aws",
      name: "AWS Inventory",
      type: "folder",
      children: [
        { id: "ec2-inv-01", name: "inventory-server", type: "resource", resourceType: "ec2", status: "running" }
      ]
    }
  ]
}

export const mockTickets: Record<string, Ticket[]> = {
  "svc-payment": [
    { id: "T-1024", title: "DB Schema Migration for Payment V2", status: "open", priority: "high", createdAt: "2024-02-01" },
    { id: "T-1025", title: "Investigate settlement job failure", status: "in_progress", priority: "high", assignee: "John Doe", createdAt: "2024-02-01" },
    { id: "T-1020", title: "Update SSL Certificates", status: "resolved", priority: "medium", createdAt: "2024-01-28" },
  ],
  "svc-auth": [
    { id: "T-1100", title: "OAuth2 implementation review", status: "open", priority: "medium", createdAt: "2024-02-02" }
  ],
  "svc-inventory": []
}
