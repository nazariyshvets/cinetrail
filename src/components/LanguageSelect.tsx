import Select, { SingleValue } from "react-select";
import CountryFlag from "react-country-flag";
import { useWindowSize } from "usehooks-ts";
import useTr from "hooks/useTr";
import LanguageCode from "types/LanguageCode";
import { TABLET_WIDTH_THRESHOLD } from "constants/constants";

interface FormatOptionLabelArgs {
  label: string;
  icon: JSX.Element;
}

interface OptionType {
  value: string;
  label: string;
  icon: JSX.Element;
}

const options = [
  {
    value: "uk-UA",
    label: "Українська",
    icon: <CountryFlag countryCode="UA" svg />,
  },
  {
    value: "en-GB",
    label: "English",
    icon: <CountryFlag countryCode="GB" svg />,
  },
  {
    value: "de-DE",
    label: "Deutsch",
    icon: <CountryFlag countryCode="DE" svg />,
  },
  {
    value: "fr-FR",
    label: "Français",
    icon: <CountryFlag countryCode="FR" svg />,
  },
  {
    value: "es-ES",
    label: "Español",
    icon: <CountryFlag countryCode="ES" svg />,
  },
  {
    value: "pt-PT",
    label: "Português",
    icon: <CountryFlag countryCode="PT" svg />,
  },
  {
    value: "pl-PL",
    label: "Polski",
    icon: <CountryFlag countryCode="PL" svg />,
  },
];

const formatOptionLabel = ({ label, icon }: FormatOptionLabelArgs) => (
  <div style={{ display: "flex", columnGap: "0.5rem" }}>
    {icon}
    <span style={{ color: "black" }}>{label}</span>
  </div>
);

function LanguageSelect() {
  const { langCode, setLangCode } = useTr();
  const { width: windowWidth } = useWindowSize();

  function handleChange(selectedOption: SingleValue<OptionType>) {
    const selectedValue = selectedOption?.value;

    if (selectedValue) {
      setLangCode(selectedValue as LanguageCode);
    }
  }

  const isBigWindowWidth = windowWidth > TABLET_WIDTH_THRESHOLD;
  const defaultValue = options.find((option) => option.value === langCode);

  return (
    <Select
      defaultValue={defaultValue}
      options={options}
      formatOptionLabel={formatOptionLabel}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          border: isBigWindowWidth ? "1px solid #fff" : "none",
          backgroundColor: isBigWindowWidth ? "transparent" : "#141414",
          boxShadow: "none",
          "&:hover": {
            border: isBigWindowWidth ? "1px solid #fff" : "none",
          },
        }),
        option: (baseStyles, { isFocused, isSelected }) => ({
          ...baseStyles,
          backgroundColor: isSelected
            ? "#ffd700"
            : isFocused
            ? "#727272"
            : "transparent",
          cursor: "pointer",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "#141414",
        }),
      }}
      isSearchable={false}
      onChange={handleChange}
    />
  );
}

export default LanguageSelect;
