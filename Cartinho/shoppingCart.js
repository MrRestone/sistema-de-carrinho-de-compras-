const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let cart = [];

function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function showMenu() {
  console.log('\n🛍️  Menu da Shopee');
  console.log('1. Adicionar produto');
  console.log('2. Remover produto');
  console.log('3. Atualizar quantidade');
  console.log('4. Ver carrinho');
  console.log('5. Sair\n');
  rl.question('Escolha uma opção: ', handleMenu);
}

function handleMenu(option) {
  switch (option.trim()) {
    case '1':
      addProduct();
      break;
    case '2':
      removeProduct();
      break;
    case '3':
      updateQuantity();
      break;
    case '4':
      viewCart();
      break;
    case '5':
      console.log('Obrigado por usar a Shopee!\n');
      rl.close();
      break;
    default:
      console.log('❌ Opção inválida.');
      showMenu();
  }
}

function addProduct() {
  rl.question('Nome do produto: ', (name) => {
    rl.question('Preço unitário (R$): ', (priceInput) => {
      const price = parseFloat(priceInput.replace(',', '.'));
      if (isNaN(price) || price <= 0) {
        console.log('❌ Preço inválido.');
        return showMenu();
      }

      rl.question('Quantidade: ', (qtyInput) => {
        const quantity = parseInt(qtyInput);
        if (isNaN(quantity) || quantity <= 0) {
          console.log('❌ Quantidade inválida.');
          return showMenu();
        }

        const existing = cart.find(p => p.name === name);
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push({ name, price, quantity });
        }

        console.log(`✅ ${quantity}x ${name} adicionado ao carrinho.`);
        showMenu();
      });
    });
  });
}

function removeProduct() {
  if (cart.length === 0) {
    console.log('🛒 Carrinho vazio.');
    return showMenu();
  }

  rl.question('Nome do produto a remover: ', (name) => {
    const index = cart.findIndex(p => p.name === name);
    if (index === -1) {
      console.log('❌ Produto não encontrado.');
    } else {
      cart.splice(index, 1);
      console.log(`🗑️  ${name} removido do carrinho.`);
    }
    showMenu();
  });
}

function updateQuantity() {
  if (cart.length === 0) {
    console.log('🛒 Carrinho vazio.');
    return showMenu();
  }

  rl.question('Nome do produto a atualizar: ', (name) => {
    const product = cart.find(p => p.name === name);
    if (!product) {
      console.log('❌ Produto não encontrado.');
      return showMenu();
    }

    rl.question('Nova quantidade: ', (qtyInput) => {
      const quantity = parseInt(qtyInput);
      if (isNaN(quantity) || quantity < 0) {
        console.log('❌ Quantidade inválida.');
      } else if (quantity === 0) {
        cart = cart.filter(p => p.name !== name);
        console.log(`🗑️  ${name} removido do carrinho.`);
      } else {
        product.quantity = quantity;
        console.log(`🔄 Quantidade de ${name} atualizada para ${quantity}.`);
      }
      showMenu();
    });
  });
}

function viewCart() {
  if (cart.length === 0) {
    console.log('🛒 Carrinho vazio.');
    return showMenu();
  }

  console.log('\n📦 Seu carrinho:');
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    console.log(`${index + 1}. ${item.name} - ${item.quantity}x ${formatPrice(item.price)} = ${formatPrice(subtotal)}`);
  });

  console.log(`\n💰 Total: ${formatPrice(total)}\n`);
  showMenu();
}

// Iniciar
console.clear();
console.log('Bem-vindo à Shopee CLI!');
showMenu();
