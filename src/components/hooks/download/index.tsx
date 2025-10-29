import { authApi } from '@/config/auth'
import { toastError } from '@/toast'
import moment from 'moment'
import { FORMAT_DATE_API } from '@/components/hooks/date/useDate'

export const useDownload = () => {

  const name = 'Result' + moment(moment.now()).format(FORMAT_DATE_API)

  const handleDownloadFileByURL = async (url: string | null | undefined, fileName = name, callback?: () => {}) => {

    if (!url) {
      toastError('Không có file để tải xuống')
      return
    }

    const res = await authApi({
      method: 'get',
      baseURL: url,
      headers: {
        'Content-Disposition': `attachment;filename="${fileName}"`,
      },
      responseType: 'blob',
    })


    try {
      const blob = new Blob([res.data], {
        type: res.headers['content-type'],
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}`
      link.click()

      if (callback) callback()
    } catch (error) {
      toastError(error)
    }

  }

  return { handleDownloadFileByURL }
}