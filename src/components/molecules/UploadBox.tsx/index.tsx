import DeleteIcon from '@/assets/svg/delete.svg'
import EditIcon from '@/assets/svg/edit.svg'
import { CoreImage } from '@/components/atoms/CoreImage'
import { fileUpload } from '@/service/resource/upload'
import { toastError } from '@/toast'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, CircularProgress, IconButton, Typography } from '@mui/material'
import Image from 'next/image'
import { ChangeEvent, useRef, useState } from 'react'

interface Props {
    textUpload?: string
    url?: string | null
    setUrl: (val: string | null) => void
}

const UploadBox = (props: Props) => {
    const { url, setUrl, textUpload = 'Upload' } = props
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)

    const refElement = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target?.files
        if (!selectedFiles?.length) return

        const file = selectedFiles[0]
        const fileSizeLimit = 5242880 // 5MB

        if (file.size > fileSizeLimit) {
            toastError('File vượt quá 5MB')
            event.stopPropagation()
            return
        }

        setLoading(true)
        setFileName(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('feature_alias', 'resources_feature1')

            const res = await fileUpload(formData)
            setUrl(res?.data?.data?.url)

            if (file.type === 'application/pdf') {
                setFileName(file.name)
            }
        } catch (e) {
            toastError(e)
        } finally {
            setLoading(false)
        }
    }

    const isPdf = url?.endsWith('.pdf')
    const displayedFileName = fileName || (isPdf ? url?.split('/').pop() || '' : '')

    return (
        <Box
            sx={{
                border: '1px dashed #DFE0EB',
                height: '100px',
                width: '100px',
                borderRadius: '4px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {loading && <CircularProgress />}

            {!loading && url && isPdf && (
                <Box className="flex flex-col items-center text-center">
                    <PictureAsPdfIcon fontSize="large" />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {displayedFileName}
                    </Typography>
                </Box>
            )}

            {!loading && url && !isPdf && (
                <CoreImage src={url} alt="Uploaded file" width={100} height={100} />
            )}

            {!loading && !url && (
                <Box className="flex flex-col items-center">
                    <CloudUploadIcon />
                    <Typography variant="body1">{textUpload}</Typography>
                </Box>
            )}

            <input
                className="hidden"
                type="file"
                accept="image/png, image/jpeg, image/jpg, application/pdf"
                onChange={handleFileUpload}
                ref={refElement}
            />

            <IconButton
                sx={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: url ? '#DFE0EB' : undefined,
                }}
                onClick={() => {
                    if (refElement.current) {
                        refElement.current.value = ''
                        refElement.current.click()
                    }
                }}
            >
                <Image src={EditIcon} alt="" width={16} height={16} />
            </IconButton>

            <IconButton
                sx={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: url ? '#DFE0EB' : undefined,
                }}
                onClick={() => {
                    setUrl(null)
                    setFileName(null)
                }}
            >
                <Image src={DeleteIcon} alt="Delete" width={16} height={16} />
            </IconButton>
        </Box>
    )
}

export default UploadBox
