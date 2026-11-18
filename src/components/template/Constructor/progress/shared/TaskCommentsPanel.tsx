import { CoreButton } from "@/components/atoms/CoreButton";
import CoreLoading from "@/components/molecules/CoreLoading";
import { useEmployeeListQuery } from "@/service/constructor/Employee/getList";
import {
  createTaskComment,
  deleteTaskComment,
  TaskComment,
  updateTaskComment,
  UploadItem,
  uploadFile,
  useTaskCommentsQuery,
} from "@/service/constructor/TaskCollab";
import { toastError, toastSuccess } from "@/toast";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo, useRef, useState } from "react";

type Props = {
  taskId: number;
  onChanged?: () => void;
};

type StaffOption = { id: number; code?: string; name: string };

const initials = (name?: string | null) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** Tô sáng các đoạn @Tên trong nội dung bình luận */
const renderContent = (content: string, mentionNames: string[]) => {
  if (!mentionNames.length) return content;
  const escaped = mentionNames
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(@(?:${escaped.join("|")}))`, "g");
  return content.split(regex).map((part, idx) =>
    part.startsWith("@") && escaped.some((n) => new RegExp(`^@${n}$`).test(part)) ? (
      <Box key={idx} component="span" sx={{ color: "primary.main", fontWeight: 700, bgcolor: "#eff6ff", px: 0.25, borderRadius: 0.5 }}>
        {part}
      </Box>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
};

/**
 * 2.27: Bình luận trong công việc – @mention đồng nghiệp (gửi thông báo), đính kèm file.
 */
export default function TaskCommentsPanel({ taskId, onChanged }: Props) {
  const queryClient = useQueryClient();
  const { data: comments = [], isLoading } = useTaskCommentsQuery(taskId);
  const { data: staffResp } = useEmployeeListQuery({ page: 0, size: 300 });
  const staffOptions: StaffOption[] = useMemo(
    () =>
      ((staffResp as any)?.data?.content ?? []).map((s: any) => ({
        id: s.id,
        code: s.code,
        name: s.name,
      })),
    [staffResp]
  );

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [content, setContent] = useState("");
  const [mentions, setMentions] = useState<StaffOption[]>([]);
  const [attachments, setAttachments] = useState<UploadItem[]>([]);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState<number>(-1);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const mentionCandidates = useMemo(() => {
    if (mentionQuery === null) return [];
    const q = mentionQuery.toLowerCase();
    return staffOptions
      .filter((s) => s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q))
      .slice(0, 6);
  }, [mentionQuery, staffOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);
    const caret = (e.target as HTMLTextAreaElement).selectionStart ?? value.length;
    const before = value.slice(0, caret);
    const match = /(^|\s)@([^\s@]{0,30})$/.exec(before);
    if (match) {
      setMentionQuery(match[2]);
      setMentionStart(caret - match[2].length - 1);
    } else {
      setMentionQuery(null);
      setMentionStart(-1);
    }
  };

  const pickMention = (staff: StaffOption) => {
    if (mentionStart < 0) return;
    const caret = inputRef.current?.selectionStart ?? content.length;
    const next = `${content.slice(0, mentionStart)}@${staff.name} ${content.slice(caret)}`;
    setContent(next);
    setMentions((prev) => (prev.some((m) => m.id === staff.id) ? prev : [...prev, staff]));
    setMentionQuery(null);
    setMentionStart(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const uploaded: UploadItem[] = [];
      for (const f of files) {
        const res = await uploadFile(f);
        if (res?.url) uploaded.push(res);
      }
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err) {
      toastError(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
    onChanged?.();
  };

  const handleSend = async () => {
    const text = content.trim();
    if (!text && !attachments.length) {
      toastError("Vui lòng nhập nội dung bình luận hoặc đính kèm tệp");
      return;
    }
    // Chỉ giữ những người còn được @ trong nội dung
    const activeMentions = mentions.filter((m) => text.includes(`@${m.name}`));
    try {
      setSending(true);
      await createTaskComment(taskId, {
        content: text,
        mentionedStaffIds: activeMentions.map((m) => m.id),
        attachments,
      });
      setContent("");
      setMentions([]);
      setAttachments([]);
      await invalidate();
    } catch (err) {
      toastError(err);
    } finally {
      setSending(false);
    }
  };

  const handleSaveEdit = async (c: TaskComment) => {
    if (!c.id) return;
    const text = editContent.trim();
    if (!text) {
      toastError("Nội dung không được để trống");
      return;
    }
    const keepIds = (c.mentionedStaffs || [])
      .filter((s) => text.includes(`@${s.name}`))
      .map((s) => s.id);
    const newIds = staffOptions
      .filter((s) => text.includes(`@${s.name}`) && !keepIds.includes(s.id))
      .map((s) => s.id);
    try {
      await updateTaskComment(taskId, c.id, {
        content: text,
        mentionedStaffIds: [...keepIds, ...newIds],
        attachments: c.attachments,
      });
      setEditingId(null);
      toastSuccess("Đã cập nhật bình luận");
      await invalidate();
    } catch (err) {
      toastError(err);
    }
  };

  const handleDelete = async (c: TaskComment) => {
    if (!c.id || !window.confirm("Xóa bình luận này?")) return;
    try {
      await deleteTaskComment(taskId, c.id);
      await invalidate();
    } catch (err) {
      toastError(err);
    }
  };

  const isImage = (a: UploadItem) =>
    (a.type || "").startsWith("image") || /\.(png|jpe?g|gif|webp|bmp)$/i.test(a.url || "");

  return (
    <Box>
      {isLoading ? (
        <CoreLoading />
      ) : comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
          Chưa có bình luận nào. Hãy là người đầu tiên trao đổi về công việc này.
        </Typography>
      ) : (
        <Stack spacing={1.5} sx={{ maxHeight: 380, overflowY: "auto", pr: 0.5, mb: 2 }}>
          {comments.map((c) => (
            <Stack key={c.id} direction="row" spacing={1.25} alignItems="flex-start">
              <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "primary.main" }}>
                {initials(c.authorName)}
              </Avatar>
              <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2, flex: 1, bgcolor: "#f8fafc" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="body2" fontWeight={700}>
                      {c.authorName || "—"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.createdAt ? moment(c.createdAt).format("DD/MM/YYYY HH:mm") : ""}
                      {c.edited ? " • đã sửa" : ""}
                    </Typography>
                  </Stack>
                  {c.canEdit && editingId !== c.id && (
                    <Stack direction="row">
                      <Tooltip title="Sửa">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingId(c.id ?? null);
                            setEditContent(c.content);
                          }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton size="small" color="error" onClick={() => handleDelete(c)}>
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Stack>

                {editingId === c.id ? (
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      minRows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => setEditingId(null)}>
                        Hủy
                      </Button>
                      <Button size="small" variant="contained" onClick={() => handleSaveEdit(c)}>
                        Lưu
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {renderContent(c.content, (c.mentionedStaffs || []).map((s) => s.name))}
                  </Typography>
                )}

                {(c.attachments || []).length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                    {(c.attachments || []).map((a, idx) =>
                      isImage(a) ? (
                        <Box
                          key={idx}
                          component="a"
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Box
                            component="img"
                            src={a.url}
                            alt={a.name}
                            sx={{ width: 88, height: 66, objectFit: "cover", borderRadius: 1, border: "1px solid #e2e8f0" }}
                          />
                        </Box>
                      ) : (
                        <Chip
                          key={idx}
                          size="small"
                          icon={<InsertDriveFileOutlinedIcon fontSize="small" />}
                          label={a.name}
                          component="a"
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                          variant="outlined"
                        />
                      )
                    )}
                  </Stack>
                )}
              </Paper>
            </Stack>
          ))}
        </Stack>
      )}

      {/* Ô soạn bình luận */}
      <Box sx={{ position: "relative" }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          minRows={2}
          size="small"
          placeholder="Viết bình luận... gõ @ để nhắc đến đồng nghiệp"
          value={content}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (mentionCandidates.length > 0 && e.key === "Enter") {
              e.preventDefault();
              pickMention(mentionCandidates[0]);
              return;
            }
            if (e.key === "Escape") setMentionQuery(null);
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        {mentionCandidates.length > 0 && (
          <Paper
            elevation={6}
            sx={{ position: "absolute", left: 8, bottom: "100%", mb: 0.5, zIndex: 20, minWidth: 260, maxHeight: 240, overflowY: "auto" }}
          >
            <List dense disablePadding>
              {mentionCandidates.map((s) => (
                <ListItemButton key={s.id} onMouseDown={(e) => e.preventDefault()} onClick={() => pickMention(s)}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 11, mr: 1 }}>{initials(s.name)}</Avatar>
                  <ListItemText primary={s.name} secondary={s.code} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {(mentions.length > 0 || attachments.length > 0) && (
        <Stack direction="row" spacing={0.75} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
          {mentions
            .filter((m) => content.includes(`@${m.name}`))
            .map((m) => (
              <Chip key={`m-${m.id}`} size="small" color="primary" variant="outlined" label={`@${m.name}`} />
            ))}
          {attachments.map((a, idx) => (
            <Chip
              key={`a-${idx}`}
              size="small"
              icon={<AttachFileIcon fontSize="small" />}
              label={a.name}
              onDelete={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
        <Button
          component="label"
          size="small"
          startIcon={<AttachFileIcon fontSize="small" />}
          disabled={uploading}
          sx={{ textTransform: "none" }}
        >
          {uploading ? "Đang tải tệp..." : "Đính kèm tệp"}
          <input hidden type="file" multiple onChange={handleAttach} />
        </Button>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            Ctrl + Enter để gửi
          </Typography>
          <CoreButton theme="submit" loading={sending} onClick={handleSend}>
            Gửi bình luận
          </CoreButton>
        </Stack>
      </Stack>
    </Box>
  );
}
