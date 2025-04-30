import { Alert, Button, Modal, Space, Typography } from 'antd'
import { ExternalLinkIcon, RotateCcwIcon, TriangleAlertIcon } from 'lucide-react'

import './TableError-styles.less'

interface TableErrorProps {
	errorMessage: string
	refetch: () => void
}

export function TableError(props: TableErrorProps) {
	const { errorMessage, refetch } = props

	const [modal, contextHolder] = Modal.useModal()

	return (
		<>
			{contextHolder}
			<Alert
				className="schoolone-table-error"
				type="error"
				message={
					<div className="schoolone-table-error__message">
						<TriangleAlertIcon color="var(--ant-color-error-text)" />
						<Typography.Title type="danger" level={4}>
							Erreur
						</Typography.Title>
					</div>
				}
				description={
					<Space direction="vertical" size="large">
						<Typography.Text>
							Une erreur est survenue lors du chargement des données. Veuillez réessayer.
						</Typography.Text>
						<Button
							variant="solid"
							color="blue"
							icon={<RotateCcwIcon size={16} />}
							onClick={refetch}
						>
							Réessayer
						</Button>
					</Space>
				}
				action={
					<Button
						size="small"
						icon={<ExternalLinkIcon size={14} />}
						onClick={() =>
							modal.info({
								title: "Détails de l'erreur",
								content: errorMessage,
								centered: true,
								okText: 'Fermer',
								okButtonProps: { type: 'default' },
							})
						}
						danger
					>
						Détails
					</Button>
				}
			/>
		</>
	)
}
