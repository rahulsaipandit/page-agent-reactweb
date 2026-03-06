// Type declarations for react-native-web
declare module 'react-native-web' {
    import { ReactNode, CSSProperties } from 'react';

    type Style = CSSProperties | any;
    type Styles = Style | Style[];

    type ViewProps = {
        style?: Styles;
        children?: ReactNode;
    };

    type TextProps = {
        style?: Styles;
        children?: ReactNode;
    };

    type ScrollViewProps = {
        style?: Styles;
        children?: ReactNode;
    };

    type TouchableOpacityProps = {
        style?: Styles;
        onPress?: () => void;
        children?: ReactNode;
    };

    type TextInputProps = {
        style?: Styles;
        value?: string;
        onChangeText?: (text: string) => void;
        placeholder?: string;
        placeholderTextColor?: string;
        onSubmitEditing?: () => void;
    };

    type SafeAreaViewProps = {
        style?: Styles;
        children?: ReactNode;
    };

    export function View(props: ViewProps): JSX.Element;
    export function Text(props: TextProps): JSX.Element;
    export function ScrollView(props: ScrollViewProps): JSX.Element;
    export function TouchableOpacity(props: TouchableOpacityProps): JSX.Element;
    export function TextInput(props: TextInputProps): JSX.Element;
    export function SafeAreaView(props: SafeAreaViewProps): JSX.Element;

    export const StyleSheet: {
        create<T>(styles: T): T;
    };
}
