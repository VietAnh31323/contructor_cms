import CoreLoading from '@/components/molecules/CoreLoading'
import { authApi } from '@/config/auth'
import { usePDFSlick } from '@pdfslick/react'
import '@pdfslick/react/dist/pdf_viewer.css'
import { ReactNode, useEffect, useId, useState } from 'react'
import PDFNavigation from './PDFNavigation'

type PDFViewerAppProps = {
  pdfFilePath: string
}

const PdfWrapper = ({ children }: { children: ReactNode }) => (
  <div className='absolute inset-0 bg-[#a7a7a7] bg-opacity-10 pdfSlick'>
    <div className='flex-1 relative min-h-[90vh] min-w-[50vw] '>{children}</div>
  </div>
)

const CorePdfViewer = ({ pdfFilePath }: PDFViewerAppProps) => {
  const [urlFile, setUrlFile] = useState<string | null>(null)
  const [loadingFile, setLoadingFile] = useState(false)

  const handleGetUrlFile = async () => {
    try {
      setLoadingFile(true)

      const res = await authApi({
        method: 'get',
        baseURL: pdfFilePath,
        responseType: 'blob',
      })

      setUrlFile(URL.createObjectURL(res?.data) ?? '')
      setLoadingFile(false)
    } catch (err) {
      setUrlFile(null)
      console.log('error file', err)
      setLoadingFile(false)
    }
  }

  useEffect(() => {
    pdfFilePath && handleGetUrlFile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfFilePath])

  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(
    urlFile ?? '',
    {
      singlePageViewer: true,
      scaleValue: 'page-fit',
    }
  )

  const data = usePDFSlickStore()
  const key = useId()

  return (
    <PdfWrapper key={key}>
      <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
      {data.isDocumentLoaded && !loadingFile ? (
        <PDFNavigation {...{ usePDFSlickStore }} />
      ) : (
        <div className='mt-[35vh]'>
          <CoreLoading />
        </div>
      )}
    </PdfWrapper>
  )
}

export { CorePdfViewer, PdfWrapper }
