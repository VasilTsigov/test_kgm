Ext.application({
    name: 'SearchApp',
    launch: function () {
        Ext.create('Ext.Panel', {
            fullscreen: true,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    title: 'Търсене',
                    margin: 10,
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'searchField',
                            label: 'Търсене',
                            placeHolder: 'Пример: А 1234',
                            regex: /^[А-Я]{1}\s\d{4}$/,
                            regexText: 'Моля, въведете една буква (сериа на кирилица), последвана от интервал и 4 цифри (например: А 1234).',
                            listeners: {
                                change: function (field) {
                                    const value = field.getValue();
                                    const store = Ext.getStore('SearchStore');

                                    if (value && value.length === 6 && /^[А-Я]{1}\s\d{4}$/.test(value)) {
                                        const [seria, number] = value.split(' ');

                                        console.log('Сериа:', seria, 'Номер:', number);

                                        // Задаваме параметрите за заявката
                                        store.getProxy().setExtraParams({
                                            seria: seria,
                                            number: number
                                        });

                                        // Зареждаме новите данни
                                        store.load();
                                    } else if (!value) {
                                        // Ако текстовото поле е празно, изчистваме NestedList
                                        store.setRoot({
                                            text: 'Резултати',
                                            expanded: true,
                                            children: [] // Празен списък с елементи
                                        });

                                    
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'nestedlist',
                    title: 'Резултати',
                    flex: 1,
                    displayField: 'text',
                    listConfig: {
                        itemTpl: new Ext.XTemplate(
                            '<tpl if="!leaf">',
                            '   <table>',
                            '       <tr><td><b>{text}</b></td></tr>',
                            '   </table>',
                            '</tpl>',
                            '<tpl if="leaf">',
                            '   <table>',
                            '       <tr>',
                            '           <td>',
                            '               <b>{text}</b><br>',
                            '               <small>Вид марка: {type}</small><br>',
                            '               <small>Град: {grad}</small>',
                            '           </td>',
                            '       </tr>',
                            '   </table>',
                            '</tpl>'
                        )
                    },
                    store: {
                        storeId: 'SearchStore',
                        type: 'tree',
                        proxy: {
                            type: 'jsonp',
                            url: 'https://vasil.iag.bg/search/SeriaAndNumber',
                            reader: {
                                type: 'json',
                                rootProperty: 'items.items'
                            }
                        },
                        root: {
                            text: 'Резултати',
                            expanded: true
                        },
                        fields: ['id', 'text', 'Type', 'educ', 'mob', 'address', 'grad', 'region', 'obsht']
                    }
                }
            ]
        });
    }
});
