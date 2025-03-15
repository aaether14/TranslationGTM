/**
 * Cart Interceptor Module
 * Intercepts clicks on cart buttons and displays a custom alert with email option
 */

// Configuration
const EMAIL_ADDRESS = 'emporo@emporo.ro';
const ALERT_TITLE = 'Solicită ofertă';
const ALERT_MESSAGE = 'Pentru comenzi din afara României, vă rugăm să ne contactați pe email pentru a solicita o ofertă.';
const CANCEL_BUTTON_TEXT = 'Anulează';
const EMAIL_BUTTON_TEXT = 'Solicită ofertă';

// Track intercepted buttons to avoid duplicates
const interceptedButtons = new WeakSet();

/**
 * Create a styled modal dialog
 * @returns {Object} Modal elements
 */
const createModal = () => {
    // Create modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '8px';
    modalContent.style.padding = '20px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '450px';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.transform = 'translateY(20px)';
    modalContent.style.transition = 'transform 0.3s ease';
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = ALERT_TITLE;
    title.style.margin = '0 0 15px 0';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    
    // Create message
    const message = document.createElement('p');
    message.textContent = ALERT_MESSAGE;
    message.style.margin = '0 0 20px 0';
    message.style.lineHeight = '1.5';
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    
    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = CANCEL_BUTTON_TEXT;
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.border = '1px solid #ddd';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.backgroundColor = '#f5f5f5';
    cancelButton.style.cursor = 'pointer';
    
    // Create email button
    const emailButton = document.createElement('button');
    emailButton.textContent = EMAIL_BUTTON_TEXT;
    emailButton.style.padding = '8px 16px';
    emailButton.style.border = 'none';
    emailButton.style.borderRadius = '4px';
    emailButton.style.backgroundColor = '#007bff';
    emailButton.style.color = 'white';
    emailButton.style.fontWeight = 'bold';
    emailButton.style.cursor = 'pointer';
    
    // Assemble the modal
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(emailButton);
    
    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    
    return { modal, modalContent, cancelButton, emailButton };
};

/**
 * Show the modal dialog
 * @param {Object} modalElements - The modal elements
 * @returns {Promise} Resolves when the user makes a choice
 */
const showModal = (modalElements) => {
    const { modal, modalContent, cancelButton, emailButton } = modalElements;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Trigger reflow for animations
    void modal.offsetWidth;
    
    // Show with animation
    modal.style.opacity = '1';
    modalContent.style.transform = 'translateY(0)';
    
    return new Promise((resolve) => {
        // Handle cancel button
        cancelButton.addEventListener('click', () => {
            hideModal(modalElements);
            resolve(false);
        });
        
        // Handle email button
        emailButton.addEventListener('click', () => {
            hideModal(modalElements);
            window.location.href = `mailto:${EMAIL_ADDRESS}`;
            resolve(true);
        });
        
        // Handle click outside modal
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal(modalElements);
                resolve(false);
            }
        });
    });
};

/**
 * Hide the modal dialog
 * @param {Object} modalElements - The modal elements
 */
const hideModal = (modalElements) => {
    const { modal, modalContent } = modalElements;
    
    // Hide with animation
    modal.style.opacity = '0';
    modalContent.style.transform = 'translateY(20px)';
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
};

/**
 * Handle cart button click
 * @param {Event} event - The click event
 */
const handleCartButtonClick = (event) => {
    try {
        // Prevent default action
        event.preventDefault();
        event.stopPropagation();
        
        // Show modal
        const modalElements = createModal();
        showModal(modalElements);
    } catch (error) {
        console.error('[CartInterceptor] Error handling cart button click:', error);
    }
};

/**
 * Check if an element is a cart button
 * @param {Element} button - The button element to check
 * @returns {boolean} True if it's a cart button
 */
const isCartButton = (button) => {
    try {
        // Check if it has data-action="buy" attribute
        if (button.getAttribute('data-action') !== 'buy') {
            return false;
        }
        
        // Check for direct children with icon-cart class
        const directChildren = button.children;
        for (let i = 0; i < directChildren.length; i++) {
            if (directChildren[i].classList.contains('icon-cart')) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('[CartInterceptor] Error checking if button is cart button:', error);
        return false;
    }
};

/**
 * Intercept a cart button by attaching event listener
 * @param {Element} button - The button element to intercept
 */
const interceptButton = (button) => {
    try {
        if (!interceptedButtons.has(button)) {
            // Mark as intercepted to avoid duplicate handlers
            interceptedButtons.add(button);
            button.setAttribute('data-cart-intercepted', 'true');
            
            // Add click event listener
            button.addEventListener('click', handleCartButtonClick, true);
            
            console.log('[CartInterceptor] Intercepted button:', button);
        }
    } catch (error) {
        console.error('[CartInterceptor] Error intercepting button:', error);
    }
};

/**
 * Process a node to find and intercept cart buttons
 * @param {Node} node - The DOM node to process
 */
const processNode = (node) => {
    try {
        // If node is a button, check if it's a cart button
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'BUTTON' && isCartButton(node)) {
                interceptButton(node);
            }
            
            // Check child buttons
            const buttons = node.querySelectorAll('button');
            buttons.forEach(button => {
                if (isCartButton(button)) {
                    interceptButton(button);
                }
            });
        }
    } catch (error) {
        console.error('[CartInterceptor] Error processing node:', error);
    }
};

/**
 * Find all cart buttons in the document and intercept them
 */
const findAndInterceptAllCartButtons = () => {
    try {
        const buttons = document.querySelectorAll('button');
        let count = 0;
        
        buttons.forEach(button => {
            if (isCartButton(button)) {
                interceptButton(button);
                count++;
            }
        });
        
        console.log(`[CartInterceptor] Found and intercepted ${count} cart buttons`);
    } catch (error) {
        console.error('[CartInterceptor] Error finding and intercepting cart buttons:', error);
    }
};

/**
 * Set up observer for dynamically added cart buttons
 */
const setupCartButtonObserver = () => {
    try {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Process only added nodes, not the entire document
                    mutation.addedNodes.forEach(processNode);
                }
            });
        });
        
        // Start observing the document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[CartInterceptor] Observer set up successfully');
    } catch (error) {
        console.error('[CartInterceptor] Error setting up observer:', error);
    }
};

/**
 * Initialize the cart interceptor
 */
export const initializeCartInterceptor = () => {
    try {
        console.log('[CartInterceptor] Initializing...');
        
        // Find and intercept all existing cart buttons
        findAndInterceptAllCartButtons();
        
        // Set up observer for dynamically added buttons
        setupCartButtonObserver();
        
        console.log('[CartInterceptor] Initialized successfully');
    } catch (error) {
        console.error('[CartInterceptor] Initialization error:', error);
    }
}; 