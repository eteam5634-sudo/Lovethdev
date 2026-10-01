import type { AppRole } from '../../lib/roles'
import { roleLabel } from '../../lib/roles'
import { Badge } from '../ui/Badge'

export function RoleBadge({ role }: { role: AppRole }) {
  const tone =
    role === 'super_admin' ? 'pink' : role === 'admin' ? 'purple' : 'cyan'

  return <Badge tone={tone}>{roleLabel(role)}</Badge>
}
