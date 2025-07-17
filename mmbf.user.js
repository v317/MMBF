// ==UserScript==
// @name         Matsmart/Motatos Best Before
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display best before date above product image on Matsmart/Motatos (all countries)
// @author       Alt
// @match        https://www.matsmart.fi/*
// @match        https://www.matsmart.se/*
// @match        https://www.motatos.de/*
// @match        https://www.motatos.dk/*
// @match        https://www.motatos.at/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // All supported "best before" phrases
    const phrases = [
        "Parasta ennen:",
        "Bäst före:",
        "Mindestens haltbar bis:",
        "Bedst før:"
    ];

    function addBestBefore() {
        // Build selector for all phrases
        const selector = phrases.map(p => `img[title^="${p}"]`).join(',');

        document.querySelectorAll(selector).forEach(img => {
            // Find the closest product container (walk up to a parent with role="listitem" or similar)
            let container = img.closest('[role="listitem"], .product-card, .relative');
            if (!container) return;

            // Avoid duplicates
            if (container.querySelector('.tm-best-before')) return;

            // Create and insert the best before date element above the image
            const span = document.createElement('span');
            span.className = 'tm-best-before';
            span.style.display = 'block';
            span.style.fontSize = '14px';
            span.style.color = '#000';
            span.style.fontWeight = 'bold';
            span.style.textAlign = 'center';
            span.style.marginBottom = '4px';
            span.textContent = img.title;
            img.parentNode.insertBefore(span, img);
        });
    }

    // Run on page load and whenever the DOM changes (for SPA behavior)
    addBestBefore();
    const observer = new MutationObserver(addBestBefore);
    observer.observe(document.body, { childList: true, subtree: true });
})();