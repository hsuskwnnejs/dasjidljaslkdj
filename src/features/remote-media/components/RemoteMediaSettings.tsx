// src/features/remote-media/components/RemoteMediaSettings.tsx
import * as React from "react";
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Paper } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import {
  getRemoteMediaUrls,
  setRemoteMediaUrls,
  addRemoteMediaUrl,
  removeRemoteMediaUrl,
} from "@/features/remote-media/remote-media";

export default function RemoteMediaSettings() {
  const [urls, setUrls] = React.useState<string[]>([]);
  const [input, setInput] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const list = await getRemoteMediaUrls();
      setUrls(list);
    })();
  }, []);

  async function handleAddOne() {
    const trimmed = input.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      window.alert("Invalid URL");
      return;
    }
    await addRemoteMediaUrl(trimmed);
    const updated = await getRemoteMediaUrls();
    setUrls(updated);
    setInput("");
  }

  async function handleRemove(u: string) {
    await removeRemoteMediaUrl(u);
    const updated = await getRemoteMediaUrls();
    setUrls(updated);
  }

  async function handlePasteManyAndSave() {
    const raw = input.trim();
    if (!raw) return;
    const tokens = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const validated: string[] = [];
    for (const t of tokens) {
      try {
        new URL(t);
        validated.push(t);
      } catch {
        // skip invalid
      }
    }
    const unique = Array.from(new Set([...urls, ...validated]));
    await setRemoteMediaUrls(unique);
    setUrls(unique);
    setInput("");
  }

  return (
    <Paper elevation={1} style={{ padding: 16, marginBottom: 16 }}>
      <Box display="flex" flexDirection="column" style={{ gap: 8 }}>
        <Typography variant="h6">Remote media links</Typography>
        <Typography variant="body2">
          Paste direct image / gif / mp4 links here. These will be included in the game scroller.
        </Typography>

        <Box display="flex" style={{ gap: 8, alignItems: "center", marginTop: 8 }}>
          <TextField
            label="Add single URL or paste multiple (newline / comma)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddOne} size="small">
            Add
          </Button>
          <Button startIcon={<SaveIcon />} variant="outlined" onClick={handlePasteManyAndSave} size="small">
            Save
          </Button>
        </Box>

        <Box style={{ marginTop: 8 }}>
          <Typography variant="subtitle2">Saved links ({urls.length})</Typography>
          <List dense>
            {urls.map((u) => (
              <ListItem key={u} divider>
                <ListItemText primary={u} secondary={u.length > 80 ? `${u.slice(0, 80)}…` : undefined} />
                <IconButton edge="end" onClick={() => handleRemove(u)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          {urls.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No remote links saved.
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Paper>
  );
}
