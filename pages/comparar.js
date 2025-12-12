// pages/comparar.js

import React from 'react';
import FakemonCompare from '../components/FakemonCompare'; // Importando o novo componente principal

export default function CompararPage() {
    return (
        <div className="p-4 sm:p-8">
            {/* O h1 foi mantido dentro do FakemonCompare, mas você pode ajustá-lo se quiser */}
            
            {/* Aqui está a ferramenta de comparação rodando */}
            <FakemonCompare />
            
        </div>
    );
}