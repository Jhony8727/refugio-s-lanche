# 📝 Como Adicionar o Logo Personalizado

## Opção 1: Logo no Header (Simples)

O logo atual usa um emoji 🍔 estilizado. Para usar sua imagem:

1. Salve a imagem do logo como `logo.png` na pasta:
   ```
   frontend/public/logo.png
   ```

2. Abra o arquivo: `frontend/src/components/Header.jsx`

3. Substitua a seção do logo (linha ~14-20) por:
   ```jsx
   <img 
     src="/logo.png" 
     alt="Refugio's Lanche"
     className="h-16 w-auto"
   />
   ```

## Opção 2: Logo Completo com Texto

Para manter o estilo atual com sua imagem:

```jsx
<div className="flex items-center gap-3">
  <img 
    src="/logo.png" 
    alt="Refugio's Lanche"
    className="h-16 w-16 rounded-full shadow-lg"
  />
  <div className="flex flex-col">
    <span className="text-2xl font-black text-orange-600">REFUGIO'S</span>
    <span className="text-2xl font-black text-gray-800">LANCHE</span>
  </div>
</div>
```

## Opção 3: Apenas a Imagem

Para usar só o logo sem texto:

```jsx
<img 
  src="/logo.png" 
  alt="Refugio's Lanche"
  className="h-20 w-auto"
/>
```

---

**Localização do arquivo:** `frontend/src/components/Header.jsx`  
**Linha aproximada:** 14-25

Após fazer a alteração, a página atualiza automaticamente! 🚀
