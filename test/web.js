let test = function (testMessage, test) {
    let status;
    try {
        status = test();
    } catch (e) {
        status = false;
        throw e;
    }

    if (status !== false) {
        console.log('SUCCESS', testMessage);
    } else {
        console.warn('FAIL', testMessage);
    }
}

test('.ready()', () => {
    let ready = () => {};

    m$().ready(ready);
    m$(ready);
})

m$(() => {
    test('m$()', () => {
        m$();
        m$('div');
        m$(document);
        m$(window);
        m$(m$('div'));
        m$('span', 'div');
        m$('span', window);
    })
    
    test('.length', () => {
        return m$().length === 0
            && m$('div').length > 0
            && m$('span', 'div').length > 0
            && m$('span').length === $('span').length
            && m$('span', 'div').length === $('span', 'div').length
    })
    
    test('.each()', () => {
        let index = 0, status = true;
        m$('div').each(function (i, elem) {
            if (this !== elem || !elem || index++ !== i) {
                return (status = false);
            }
        });
    
        return status;
    })
    
    test('.get()', function () {
        let find = m$('div');
        find.each((i, elem) => {
            if (elem !== find.get(i) || elem !== find[i]) {
                return (status = false);
            }
        });
    })
    
    test('.find()', () => {
        let status = true;
        let find1 = m$('div').find('span');
        let find2 = m$('span', 'div');
    
        find1.each((i, elem) => {
            if (elem !== find2.get(i)) {
                return (status = false);
            }
        });

        return status;
    })

    test('.is()', () => {
        return m$('div').is('div') && !m$('div').is('span')
    })

    test('.not()', () => {
        return !m$('div').not('div').length && m$('div').not('span').length
    })

    test('.has()', () => {
        return m$('div').has('div').length 
            && m$('div').has('span').length
            && !m$('div').has('nothing').length
    })

    test('.filter()', () => {
        return  m$('div').filter('.layer-1').length ===
                m$('div').filter((_, elem) => m$(elem).is('.layer-1')).length;
    })

    test('.parent()', () => {
        return m$('span').parent().length === $('span').parent().length;
    })
})
