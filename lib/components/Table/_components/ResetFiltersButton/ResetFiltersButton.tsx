import { Button } from 'antd'
import { FilterX } from 'lucide-react'

import './ResetFiltersButton-styles.less'

interface ResetFiltersButtonProps {
	onClick: () => void
}

export function ResetFiltersButton({ onClick }: ResetFiltersButtonProps) {
	return (
		<Button
			className="schoolone-table--reset-filters-btn"
			type="primary"
			icon={<FilterX size={16} />}
			onClick={onClick}
		>
			Réinitiliser les filtres
		</Button>
	)
}
