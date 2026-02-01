
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
  details?: {
    ip?: string
    region?: string
    uptime?: string
    cpu?: string
    memory?: string
  }
}

export type Ticket = {
  id: string
  title: string
  status: "open" | "in_progress" | "resolved"
  priority: "high" | "medium" | "low"
  assignee?: string
  createdAt: string
  description?: string
  comments?: { user: string; text: string; time: string }[]
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
            { 
              id: "ec2-pay-api-01", 
              name: "api-server-01", 
              type: "resource", 
              resourceType: "ec2", 
              status: "running",
              details: {
                ip: "10.0.1.45",
                region: "us-east-1a",
                uptime: "14d 2h",
                cpu: "12%",
                memory: "64%"
              }
            },
            { 
              id: "ec2-pay-api-02", 
              name: "api-server-02", 
              type: "resource", 
              resourceType: "ec2", 
              status: "running",
              details: {
                ip: "10.0.1.46",
                region: "us-east-1b",
                uptime: "14d 2h",
                cpu: "15%",
                memory: "61%"
              }
            },
            { 
              id: "ec2-pay-worker", 
              name: "payment-worker", 
              type: "resource", 
              resourceType: "ec2", 
              status: "stopped",
              details: {
                ip: "10.0.2.10",
                region: "us-east-1c",
                uptime: "0s",
              }
            },
          ]
        },
        {
          id: "folder-db",
          name: "Database",
          type: "folder",
          children: [
            { 
              id: "rds-main", 
              name: "payment-db-primary", 
              type: "resource", 
              resourceType: "rds", 
              status: "running",
              details: {
                region: "us-east-1",
                uptime: "120d",
                cpu: "45%",
                memory: "82%"
              }
            },
            { 
              id: "rds-read", 
              name: "payment-db-replica", 
              type: "resource", 
              resourceType: "rds", 
              status: "running",
              details: {
                region: "us-east-1",
                uptime: "120d",
                cpu: "10%",
                memory: "30%"
              }
            },
          ]
        }
      ]
    },
    {
      id: "folder-k8s",
      name: "Kubernetes Cluster",
      type: "folder",
      children: [
        { 
          id: "pod-pay-gw", 
          name: "payment-gateway", 
          type: "resource", 
          resourceType: "k8s", 
          status: "running",
          details: {
            ip: "192.168.1.50",
            uptime: "3d 5h",
            cpu: "5m",
            memory: "120Mi"
          }
        },
        { 
          id: "pod-pay-settle", 
          name: "settlement-job", 
          type: "resource", 
          resourceType: "k8s", 
          status: "error",
          details: {
            uptime: "0s",
            cpu: "0m",
            memory: "0Mi"
          }
        },
      ]
    }
  ],
  "svc-auth": [
    {
      id: "folder-auth-aws",
      name: "AWS Auth",
      type: "folder",
      children: [
        { 
          id: "ec2-auth-01", 
          name: "auth-server", 
          type: "resource", 
          resourceType: "ec2", 
          status: "running",
          details: {
            ip: "10.1.0.5",
            region: "eu-west-1",
            uptime: "30d",
            cpu: "5%",
            memory: "20%"
          }
        }
      ]
    }
  ]
}

export const mockTickets: Record<string, Ticket[]> = {
  "svc-payment": [
    { 
      id: "T-1024", 
      title: "DB Schema Migration for Payment V2", 
      status: "open", 
      priority: "high", 
      createdAt: "2024-02-01",
      description: "We need to add the new `transaction_ref` column to the `payments` table. This is a blocking requirement for the V2 API release.",
      comments: [
        { user: "Alice", text: "Is this backward compatible?", time: "2h ago" },
        { user: "Bob", text: "Yes, it's nullable.", time: "1h ago" }
      ]
    },
    { 
      id: "T-1025", 
      title: "Investigate settlement job failure", 
      status: "in_progress", 
      priority: "high", 
      assignee: "John Doe", 
      createdAt: "2024-02-01",
      description: "The settlement job failed last night with OOM error. Logs indicate a memory spike during batch processing.",
      comments: [
        { user: "John", text: "Checking the heap dump now.", time: "30m ago" }
      ]
    },
    { 
      id: "T-1020", 
      title: "Update SSL Certificates", 
      status: "resolved", 
      priority: "medium", 
      createdAt: "2024-01-28",
      description: "Rotate the wildcard certs for *.ocean1.dev before expiry.",
      comments: []
    },
  ],
  "svc-auth": [
    { 
      id: "T-1100", 
      title: "OAuth2 implementation review", 
      status: "open", 
      priority: "medium", 
      createdAt: "2024-02-02",
      description: "Security team needs to review the new OAuth2 flow before we go live.",
      comments: []
    }
  ],
  "svc-inventory": []
}
