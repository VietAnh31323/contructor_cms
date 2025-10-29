import EditIcon from '@/components/icons/EditIcon'
import PrintIcon from '@/components/icons/PrintIcon'
import { TRANSLATE } from '@/routes'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import { Box, IconButton, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

export type ActionType =
  | 'delete'
  | 'watch'
  | 'edit'
  | 'append'
  | 'remove'
  | 'copy'
  | 'export'
  | 'import'
  | 'history'
  | 'view'
  | 'print'
  | 'assign'

type Props = {
  isShowText?: boolean
  actionList: ActionType[]
  onWatchAction?: () => void
  onDeleteAction?: () => void
  onEditAction?: () => void
  onAppendAction?: () => void
  onRemoveAction?: () => void
  onCopyAction?: () => void
  onExportAction?: () => void
  onImportAction?: () => void
  onHistoryAction?: () => void
  onViewAction?: () => void
  onPrintAction?: () => void
  onAssignAction?: () => void
}

export const TopAction = ({
                            isShowText = true,
                            actionList,
                            onWatchAction,
                            onDeleteAction,
                            onEditAction,
                            onAppendAction,
                            onRemoveAction,
                            onCopyAction,
                            onHistoryAction,
                            onViewAction,
                            onExportAction,
                            onImportAction,
                            onAssignAction,
                            onPrintAction,
                          }: Props) => {
  const { t } = useTranslation(TRANSLATE.COMMON)

  return (
    <div className="flex items-center gap-4">
      {actionList.includes('print') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onPrintAction}
        >
          <PrintIcon />
          {isShowText && (
            <Typography variant="body2" sx={{ color: '#00CC6A' }}>
              In
            </Typography>
          )}
        </div>
      )}
      {actionList.includes('view') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onViewAction}
        >
          <IconButton>
            <Image
              src={require('@/assets/svg/action/view.svg')}
              alt="view"
              width={16}
              height={16}
            />
          </IconButton>

          {isShowText && (
            <Typography variant="body2">{t('btn.view')}</Typography>
          )}
        </div>
      )}

      {actionList.includes('edit') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onEditAction}
        >
          <EditIcon />
          {isShowText && (
            <Typography variant="body2" sx={{ color: '#0078D4' }}>
              {t('btn.edit')}
            </Typography>
          )}
        </div>
      )}

      {actionList.includes('watch') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onWatchAction}
        >
          <IconButton>
            <Image
              src={require('@/assets/svg/action/watch.svg')}
              alt="watch"
              width={16}
              height={16}
            />
          </IconButton>
          {isShowText && <Typography variant="body2">{t('detail')}</Typography>}
        </div>
      )}

      {actionList.includes('delete') && (
        <Box
          className="flex items-center cursor-pointer"
          onClick={onDeleteAction}
        >
          <IconButton>
            <Image
              src={require('@/assets/svg/action/delete.svg')}
              alt="delete"
              width={16}
              height={16}
            />
          </IconButton>
          {isShowText && (
            <Typography variant="body2" sx={{ color: '#FF4956' }}>
              {t('btn.delete')}
            </Typography>
          )}
        </Box>
      )}

      {actionList.includes('append') && (
        <IconButton onClick={onAppendAction}>
          <Image
            src={require('@/assets/svg/action/append.svg')}
            alt="append"
            width={16}
            height={16}
          />
        </IconButton>
      )}

      {actionList.includes('remove') && (
        <IconButton onClick={onRemoveAction}>
          <Image
            src={require('@/assets/svg/action/remove.svg')}
            alt="remove"
            width={16}
            height={16}
          />
        </IconButton>
      )}

      {actionList.includes('copy') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onCopyAction}
        >
          <IconButton>
            <Image
              src={require('@/assets/svg/action/copy.svg')}
              alt="copy"
              width={16}
              height={16}
            />
          </IconButton>
          {isShowText && (
            <Typography variant="body2">{t('btn.copy')}</Typography>
          )}
        </div>
      )}

      {actionList.includes('import') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onImportAction}
        >
          <IconButton>
            <Image
              src={require('@/assets/svg/action/import.svg')}
              alt="import"
              width={16}
              height={16}
            />
          </IconButton>
          {isShowText && (
            <Typography variant="body2" style={{
                color: '#00cc6a',
              }}>{t('btn.import')}</Typography>
          )}
        </div>
      )}

      {actionList.includes('export') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onExportAction}
        >
          <IconButton>
            <Image
              src={require('@/assets/svg/action/export.svg')}
              alt="export"
              width={16}
              height={16}
            />
          </IconButton>

          {isShowText && (
            <Typography
              variant="body2"
              style={{
                color: '#F58020',
              }}
            >
              {t('btn.export')}
            </Typography>
          )}
        </div>
      )}

      {actionList.includes('history') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onHistoryAction}
        >
          <IconButton>
            <Image
              src={require('@/assets/svg/action/history.svg')}
              alt="copy"
              width={16}
              height={16}
            />
          </IconButton>
          {isShowText && (
            <Typography variant="body2">{t('btn.history')}</Typography>
          )}
        </div>
      )}

      {actionList.includes('assign') && (
        <div
          className="flex items-center cursor-pointer"
          onClick={onAssignAction}
        >
          <IconButton>
            <AssignmentIndIcon
              fontSize="small"
              color="primary"
            ></AssignmentIndIcon>
          </IconButton>

          {isShowText && <Typography variant="body2">Gán</Typography>}
        </div>
      )}
    </div>
  )
}
