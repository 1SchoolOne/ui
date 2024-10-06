import { Button } from 'antd'
import { FilterX } from 'lucide-react'

interface ResetFiltersButtonProps {
	onClick: () => void
}

export function ResetFiltersButton({ onClick }: ResetFiltersButtonProps) {
	return (
		<Button type="primary" icon={<FilterX size={16} />} onClick={onClick}>
			Réinitiliser les filtres
		</Button>
	)
}
