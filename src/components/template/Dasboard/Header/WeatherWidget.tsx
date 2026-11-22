import AcUnitIcon from "@mui/icons-material/AcUnit";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
  Box,
  Chip,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type WeatherKind = "SUNNY" | "CLOUDY" | "RAIN" | "STORM" | "FOG";

interface CityOption {
  name: string;
  lat: number;
  lon: number;
}

const CITIES: CityOption[] = [
  { name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
  { name: "TP. Hồ Chí Minh", lat: 10.8231, lon: 106.6297 },
  { name: "Đà Nẵng", lat: 16.0544, lon: 108.2022 },
  { name: "Hải Phòng", lat: 20.8449, lon: 106.6881 },
  { name: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
];

interface WeatherState {
  temp: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  kind: WeatherKind;
  label: string;
  advisory: string;
  daily: { date: string; max: number; min: number; kind: WeatherKind }[];
}

function mapWmoCode(code: number): {
  kind: WeatherKind;
  label: string;
  advisory: string;
} {
  if (code === 0 || code === 1) {
    return {
      kind: "SUNNY",
      label: "Nắng đẹp",
      advisory: "Thuận lợi đổ bê tông & thi công ngoài trời",
    };
  }
  if (code === 2 || code === 3) {
    return {
      kind: "CLOUDY",
      label: "Có mây",
      advisory: "Thời tiết mát mẻ, thuận lợi thi công",
    };
  }
  if (code === 45 || code === 48) {
    return {
      kind: "FOG",
      label: "Sương mù",
      advisory: "Chú ý tầm nhìn vận chuyển vật tư",
    };
  }
  if (code >= 95) {
    return {
      kind: "STORM",
      label: "Mưa dông",
      advisory: "Tạm dừng làm việc trên cao & kiểm tra chống sét",
    };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      kind: "RAIN",
      label: "Có mưa",
      advisory: "Che chắn xi măng, thép & hạn chế đổ bê tông",
    };
  }
  return {
    kind: "CLOUDY",
    label: "Nhiều mây",
    advisory: "Điều kiện thi công bình thường",
  };
}

const VN_DAYS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export default function WeatherWidget() {
  const [now, setNow] = useState<Date | null>(null);
  const [cityName, setCityName] = useState<string>("Hà Nội");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [weather, setWeather] = useState<WeatherState>({
    temp: 27,
    tempMax: 30,
    tempMin: 22,
    humidity: 72,
    windSpeed: 10,
    kind: "SUNNY",
    label: "Nắng nhẹ",
    advisory: "Thuận lợi đổ bê tông & thi công ngoài trời",
    daily: [],
  });

  useEffect(() => {
    setNow(new Date());
    const saved = localStorage.getItem("cms_weather_city");
    if (saved && CITIES.some((c) => c.name === saved)) {
      setCityName(saved);
    }
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const city = CITIES.find((c) => c.name === cityName) ?? CITIES[0];
    let cancelled = false;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok&forecast_days=4`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.current) return;
        const mapped = mapWmoCode(Number(data.current.weather_code ?? 0));
        const daily = (data.daily?.time ?? [])
          .slice(1, 4)
          .map((d: string, i: number) => ({
            date: d,
            max: Math.round(data.daily.temperature_2m_max[i + 1] ?? 29),
            min: Math.round(data.daily.temperature_2m_min[i + 1] ?? 22),
            kind: mapWmoCode(Number(data.daily.weather_code[i + 1] ?? 0)).kind,
          }));
        setWeather({
          temp: Math.round(data.current.temperature_2m ?? 27),
          tempMax: Math.round(data.daily?.temperature_2m_max?.[0] ?? 30),
          tempMin: Math.round(data.daily?.temperature_2m_min?.[0] ?? 22),
          humidity: Math.round(data.current.relative_humidity_2m ?? 70),
          windSpeed: Math.round(data.current.wind_speed_10m ?? 10),
          ...mapped,
          daily,
        });
      })
      .catch(() => {
        // Giữ fallback an toàn khi offline
      });
    return () => {
      cancelled = true;
    };
  }, [cityName]);

  const bgByKind: Record<WeatherKind, string> = {
    SUNNY: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    CLOUDY: "linear-gradient(135deg, #3b82f6 0%, #64748b 100%)",
    RAIN: "linear-gradient(135deg, #0284c7 0%, #1e3a8a 100%)",
    STORM: "linear-gradient(135deg, #312e81 0%, #0f172a 100%)",
    FOG: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
  };

  const renderIcon = (kind: WeatherKind, size = 20) => {
    switch (kind) {
      case "SUNNY":
        return (
          <WbSunnyIcon
            sx={{
              fontSize: size,
              color: "#fef08a",
              animation: "spinSun 12s linear infinite",
            }}
          />
        );
      case "RAIN":
        return (
          <WaterDropIcon
            sx={{
              fontSize: size,
              color: "#bae6fd",
              animation: "rainPulse 1.4s ease-in-out infinite",
            }}
          />
        );
      case "STORM":
        return (
          <ThunderstormIcon
            sx={{
              fontSize: size,
              color: "#fde047",
              animation: "flashStorm 2.4s infinite",
            }}
          />
        );
      case "FOG":
        return <AcUnitIcon sx={{ fontSize: size, color: "#e2e8f0" }} />;
      default:
        return (
          <CloudIcon
            sx={{
              fontSize: size,
              color: "#f8fafc",
              animation: "floatCloud 3.5s ease-in-out infinite",
            }}
          />
        );
    }
  };

  const dayStr = now ? VN_DAYS[now.getDay()] : "";
  const dateStr = now ? now.toLocaleDateString("vi-VN") : "";
  const timeStr = now
    ? now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <>
      <style>{`
        @keyframes spinSun {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatCloud {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(3px); }
        }
        @keyframes rainPulse {
          0%, 100% { transform: translateY(0px); opacity: 1; }
          50% { transform: translateY(3px); opacity: 0.7; }
        }
        @keyframes flashStorm {
          0%, 88%, 100% { opacity: 1; }
          92% { opacity: 0.35; }
          96% { opacity: 1; }
        }
        @keyframes rainFall {
          0% { transform: translateY(-10px); opacity: 0; }
          40% { opacity: 0.65; }
          100% { transform: translateY(28px); opacity: 0; }
        }
      `}</style>

      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          position: "relative",
          overflow: "hidden",
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          gap: 1.5,
          px: 1.8,
          py: 0.75,
          borderRadius: "12px",
          background: bgByKind[weather.kind],
          color: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.14)",
          transition: "transform 0.15s",
          "&:hover": { transform: "translateY(-1px)" },
        }}
      >
        {/* Hiệu ứng hạt mưa rơi trực tiếp trên badge khi trời mưa/dông */}
        {(weather.kind === "RAIN" || weather.kind === "STORM") && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {[15, 38, 62, 84].map((left, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  left: `${left}%`,
                  top: 0,
                  width: "1.5px",
                  height: "9px",
                  bgcolor: "rgba(255,255,255,0.55)",
                  animation: `rainFall ${0.8 + i * 0.18}s linear infinite`,
                }}
              />
            ))}
          </Box>
        )}

        {renderIcon(weather.kind, 22)}

        <Box sx={{ lineHeight: 1.15, zIndex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight={800} fontSize={13}>
              {weather.temp}°C • {cityName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                px: 0.8,
                py: 0.1,
                borderRadius: 1,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {weather.label}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.9)", fontSize: 11 }}
          >
            {dayStr}, {dateStr} • {timeStr}
          </Typography>
        </Box>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 320, borderRadius: 3, p: 2, mt: 1 },
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" fontWeight={800}>
              Thời tiết công trường
            </Typography>
            <TextField
              select
              size="small"
              value={cityName}
              onChange={(e) => {
                setCityName(e.target.value);
                localStorage.setItem("cms_weather_city", e.target.value);
              }}
              sx={{ minWidth: 140 }}
            >
              {CITIES.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Box
            sx={{
              p: 1.8,
              borderRadius: 2,
              color: "#ffffff",
              background: bgByKind[weather.kind],
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {weather.temp}°C
                </Typography>
                <Typography variant="caption">
                  {weather.label} • {weather.tempMin}° / {weather.tempMax}°
                </Typography>
              </Box>
              {renderIcon(weather.kind, 38)}
            </Stack>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Độ ẩm: {weather.humidity}% • Gió: {weather.windSpeed} km/h
            </Typography>
          </Box>

          <Chip
            size="small"
            label={weather.advisory}
            color={
              weather.kind === "RAIN" || weather.kind === "STORM"
                ? "warning"
                : "success"
            }
            variant="outlined"
            sx={{ height: "auto", "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 } }}
          />

          {weather.daily.length > 0 && (
            <Stack spacing={0.8}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                Dự báo 3 ngày tới
              </Typography>
              {weather.daily.map((d) => (
                <Stack
                  key={d.date}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ px: 1, py: 0.5, bgcolor: "#f8fafc", borderRadius: 1 }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    {new Date(d.date).toLocaleDateString("vi-VN")}
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    {d.min}°C – {d.max}°C
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Popover>
    </>
  );
}
