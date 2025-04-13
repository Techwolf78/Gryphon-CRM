export const generateProjectId = (title, existingIds = []) => {
    const words = title
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean);
  
    let abbr = words.map(w => w[0].toUpperCase()).join("");
  
    if (abbr.length < 3) {
      abbr = abbr.padEnd(3, "X");
    } else if (abbr.length > 5) {
      abbr = abbr.slice(0, 5);
    }
  
    // Assign unique 3-digit suffix
    let suffix = 100;
    while (existingIds.includes(`${abbr}${suffix}`)) {
      suffix++;
    }
  
    return `${abbr}${suffix}`;
  };
  