import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ onLanguageChange, disabled }: LanguageSelectorProps) {
  return (
    <Select onValueChange={onLanguageChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="te">Telugu</SelectItem>
        <SelectItem value="es">Spanish</SelectItem>
        <SelectItem value="fr">French</SelectItem>
        <SelectItem value="de">German</SelectItem>
        <SelectItem value="it">Italian</SelectItem>
        <SelectItem value="pt">Portuguese</SelectItem>
        <SelectItem value="hi">Hindi</SelectItem>
        <SelectItem value="zh">Chinese</SelectItem>
      </SelectContent>
    </Select>
  );
}