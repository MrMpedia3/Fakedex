// 1. Importa as cores que você corrigiu anteriormente.
// O caminho é '../styles/typeColors' pois a pasta 'utils' e 'styles' estão na raiz.
import { moveTypeColor } from "../styles/typeColors";

/**
 * Gera um objeto de estilo CSS para um gradiente de fundo baseado nos tipos do Fakemon.
 * * @param {string[]} types - Um array de tipos (ex: ['Fogo', 'Voador'] ou ['Normal']).
 * @returns {object} Um objeto de estilo CSS-in-JS.
 */
export default function getTypeGradientStyle(types) {
  // Se não houver tipos (ou estiver vazio), retorna um fundo padrão.
  if (!types || types.length === 0) {
    return { background: '#AAAAAA' }; // Cor cinza padrão
  }

  // O primeiro tipo define a cor inicial do gradiente.
  const type1 = types[0];
  // Se houver dois tipos, o segundo tipo define a cor final.
  // Se houver apenas um tipo, usa a cor do primeiro tipo para um gradiente sólido/sutil.
  const type2 = types.length > 1 ? types[1] : types[0];

  // Busca as cores no objeto 'moveTypeColor'. 
  // Usa uma cor de fallback (#B3B3B3) se a cor do tipo não for encontrada.
  const color1 = moveTypeColor[type1] || '#B3B3B3'; 
  const color2 = moveTypeColor[type2] || color1;

  // Retorna o objeto de estilo CSS para o gradiente de 90 graus (horizontal).
  return {
    background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`,
  };
}