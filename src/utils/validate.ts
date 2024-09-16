export const validateName = (value: string) => {
  // Verifica se o nome contém pelo menos um nome e um sobrenome
  const nameParts = value.trim().split(/\s+/);
  if (nameParts.length < 2) {
    return "Por favor, insira tanto o nome quanto o sobrenome.";
  }
  if (value.length < 4) {
    return "O nome completo deve ter pelo menos 4 caracteres.";
  }
  return true; // Validação bem-sucedida
};
