<?php

namespace QUITests\Dashboard;

use PHPUnit\Framework\TestCase;
use QUI\Dashboard\DashboardHandler;
use QUI\Dashboard\DashboardInterface;
use QUI\Dashboard\DashboardProviderInterface;
use QUI\Utils\Singleton;

class DashboardHandlerUnitTest extends TestCase
{
    public function testGetCardsForUsersDashboardFiltersDisabledCardsAndReindexes(): void
    {
        $Handler = $this->getMockBuilder(DashboardHandler::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getCardsWithSettings'])
            ->getMock();

        $Handler->method('getCardsWithSettings')
            ->willReturn([
                4 => [
                    'card' => 'card/one',
                    'enabled' => true,
                    'priority' => 10
                ],
                9 => [
                    'card' => 'card/two',
                    'enabled' => false,
                    'priority' => 20
                ],
                13 => [
                    'card' => 'card/three',
                    'enabled' => true,
                    'priority' => null
                ]
            ]);

        $result = $Handler->getCardsForUsersDashboard();

        $this->assertCount(2, $result);
        $this->assertSame([0, 1], array_keys($result));
        $this->assertSame('card/one', $result[0]['card']);
        $this->assertSame('card/three', $result[1]['card']);
    }

    public function testGetAllGeneralCardsMergesProviderCardsAndCachesResult(): void
    {
        $providerA = new class implements DashboardProviderInterface {
            public static function getCards(): array
            {
                return ['card/a1', 'card/a2'];
            }

            public static function getBoards(): array
            {
                return [];
            }
        };

        $providerB = new class implements DashboardProviderInterface {
            public static function getCards(): array
            {
                return ['card/b1'];
            }

            public static function getBoards(): array
            {
                return [];
            }
        };

        $Handler = $this->getMockBuilder(DashboardHandler::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getProviders'])
            ->getMock();

        $Handler->expects($this->once())
            ->method('getProviders')
            ->willReturn([$providerA, $providerB]);

        $first = $Handler->getAllGeneralCards();
        $second = $Handler->getAllGeneralCards();

        $this->assertSame(['card/b1', 'card/a1', 'card/a2'], $first);
        $this->assertSame($first, $second);
    }

    public function testGetBoardsMergesBoardsFromProviders(): void
    {
        $providerA = new class implements DashboardProviderInterface {
            public static function getCards(): array
            {
                return [];
            }

            public static function getBoards(): array
            {
                return [
                    new class implements DashboardInterface {
                        public function getTitle(?\QUI\Locale $Locale = null): string
                        {
                            return 'Board A';
                        }

                        public function getCards(): array
                        {
                            return ['card/a'];
                        }

                        public function getJavaScriptControl(): string
                        {
                            return 'control/a';
                        }
                    }
                ];
            }
        };

        $providerB = new class implements DashboardProviderInterface {
            public static function getCards(): array
            {
                return [];
            }

            public static function getBoards(): array
            {
                return [
                    new class implements DashboardInterface {
                        public function getTitle(?\QUI\Locale $Locale = null): string
                        {
                            return 'Board B';
                        }

                        public function getCards(): array
                        {
                            return ['card/b'];
                        }

                        public function getJavaScriptControl(): string
                        {
                            return 'control/b';
                        }
                    }
                ];
            }
        };

        $Handler = $this->getMockBuilder(DashboardHandler::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getProviders'])
            ->getMock();

        $Handler->method('getProviders')->willReturn([$providerA, $providerB]);

        $boards = $Handler->getBoards();

        $this->assertCount(2, $boards);
        $this->assertSame('Board B', $boards[0]->getTitle());
        $this->assertSame('Board A', $boards[1]->getTitle());
    }

    public function testGetCardsFromBoardReturnsCardsAndEmptyResultForInvalidBoard(): void
    {
        $Board = new class implements DashboardInterface {
            public function getTitle(?\QUI\Locale $Locale = null): string
            {
                return 'Board';
            }

            public function getCards(): array
            {
                return ['card/from-board'];
            }

            public function getJavaScriptControl(): string
            {
                return 'control/board';
            }
        };

        $SingletonHandler = $this->getMockBuilder(DashboardHandler::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getBoards'])
            ->getMock();

        $SingletonHandler->method('getBoards')->willReturn([$Board]);

        $previous = $this->setDashboardHandlerSingleton($SingletonHandler);

        try {
            $this->assertSame(['card/from-board'], DashboardHandler::getInstance()->getCardsFromBoard(0));
            $this->assertSame([], DashboardHandler::getInstance()->getCardsFromBoard(7));
        } finally {
            $this->setDashboardHandlerSingleton($previous);
        }
    }

    public function testGetCardsWithSettingsReturnsDefaultsWithoutStoredSettings(): void
    {
        $Handler = $this->getMockBuilder(DashboardHandler::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getAllGeneralCards'])
            ->getMock();

        $Handler->method('getAllGeneralCards')->willReturn(['card/default']);

        $this->assertSame([
            [
                'card' => 'card/default',
                'enabled' => true,
                'priority' => null
            ]
        ], $Handler->getCardsWithSettings());
    }

    public function testGetProvidersReturnsPresetProvidersWithoutExternalLookup(): void
    {
        $Handler = new DashboardHandler();
        $Reflection = new \ReflectionClass($Handler);

        $providersProperty = $Reflection->getProperty('providers');
        $providersProperty->setAccessible(true);
        $providersProperty->setValue($Handler, [
            new class implements DashboardProviderInterface {
                public static function getCards(): array
                {
                    return [];
                }

                public static function getBoards(): array
                {
                    return [];
                }
            }
        ]);

        $method = $Reflection->getMethod('getProviders');
        $method->setAccessible(true);
        $result = $method->invoke($Handler);

        $this->assertCount(1, $result);
        $this->assertInstanceOf(DashboardProviderInterface::class, $result[0]);
    }

    private function setDashboardHandlerSingleton(?DashboardHandler $Handler): ?DashboardHandler
    {
        $Reflection = new \ReflectionClass(Singleton::class);
        $property = $Reflection->getProperty('instances');
        $property->setAccessible(true);

        $instances = $property->getValue();
        $previous = $instances[DashboardHandler::class] ?? null;

        if ($Handler === null) {
            unset($instances[DashboardHandler::class]);
        } else {
            $instances[DashboardHandler::class] = $Handler;
        }

        $property->setValue(null, $instances);

        return $previous;
    }
}
