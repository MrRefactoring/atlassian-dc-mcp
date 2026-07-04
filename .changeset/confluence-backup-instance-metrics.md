---
"confluence-datacenter-mcp": minor
---

Add confluence_triggerSiteBackup, confluence_getBackupRestoreJob, confluence_findBackupRestoreJobs and confluence_getInstanceMetrics, wrapping the generated BackupAndRestoreService and InstanceMetricsService. Scope is deliberately limited to triggering a site backup and querying job/instance status; the generated client's restore, file-upload, job-cancellation and file-listing operations are not wrapped as they're out of scope for this niche admin surface.
