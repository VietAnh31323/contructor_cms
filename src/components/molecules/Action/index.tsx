import { IconButton } from '@mui/material'
import Image from 'next/image'

export type ActionType =
  | 'delete'
  | 'watch'
  | 'edit'
  | 'append'
  | 'remove'
  | 'copy'
  | 'history'

type Props = {
  actionList: ActionType[]
  onWatchAction?: () => void
  onDeleteAction?: () => void
  onEditAction?: () => void
  onAppendAction?: () => void
  onRemoveAction?: () => void
  onCopyAction?: () => void
  onHistoryAction?: () => void
}

export const Action = ({
                         actionList,
                         onWatchAction,
                         onDeleteAction,
                         onEditAction,
                         onAppendAction,
                         onRemoveAction,
                         onCopyAction,
                         onHistoryAction,
                       }: Props) => {
  return (
    <div className="flex items-center">
      {actionList.includes('history') && (
        <IconButton onClick={onHistoryAction}>
          <Image
            src={require('@/assets/svg/action/history.svg')}
            alt="copy"
            width={16}
            height={16}
          />
        </IconButton>
      )}

      {actionList.includes('watch') && (
        <IconButton onClick={onWatchAction}>
          <Image
            src={require('@/assets/svg/action/watch.svg')}
            alt="watch"
            width={16}
            height={16}
          />
        </IconButton>
      )}

      {actionList.includes('edit') && (
        <IconButton onClick={onEditAction}>
          <Image
            src={require('@/assets/svg/action/edit.svg')}
            alt="edit"
            width={16}
            height={16}
          />
        </IconButton>
      )}

      {actionList.includes('delete') && (
        <IconButton onClick={onDeleteAction}>
          <Image
            src={require('@/assets/svg/action/delete.svg')}
            alt="delete"
            width={16}
            height={16}
          />
        </IconButton>
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
        <IconButton onClick={onCopyAction}>
          <Image
            src={require('@/assets/svg/action/copy.svg')}
            alt="copy"
            width={16}
            height={16}
          />
        </IconButton>
      )}
    </div>
  )
}
